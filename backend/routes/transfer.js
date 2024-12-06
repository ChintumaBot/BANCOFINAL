const db = require('../db');
const transferFunds = async (req, res) => {
  const { fromUserId, toUserId, amount, concepto, descripcion } = req.body;

  if (!fromUserId || !toUserId || !amount || amount <= 0 || !concepto) {
    return res.status(400).json({ message: 'Datos inválidos.' });
  }

  try {
    db.beginTransaction((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al iniciar la transacción.' });
      }

      db.query('SELECT saldo FROM cuentas WHERE id = ?', [fromUserId], (err, fromUser) => {
        if (err || !fromUser.length) {
          return db.rollback(() => {
            res.status(400).json({ message: 'Usuario origen no encontrado.' });
          });
        }

        db.query('SELECT saldo FROM cuentas WHERE id = ?', [toUserId], (err, toUser) => {
          if (err || !toUser.length) {
            return db.rollback(() => {
              res.status(400).json({ message: 'Usuario destino no encontrado.' });
            });
          }

          if (fromUser[0].saldo < amount) {
            return db.rollback(() => {
              res.status(400).json({ message: 'Saldo insuficiente.' });
            });
          }

          db.query('UPDATE cuentas SET saldo = saldo - ? WHERE id = ?', [amount, fromUserId], (err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ message: 'Error al actualizar saldo del usuario origen.' });
              });
            }

            db.query('UPDATE cuentas SET saldo = saldo + ? WHERE id = ?', [amount, toUserId], (err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ message: 'Error al actualizar saldo del usuario destino.' });
                });
              }

              const descripcionFinal = descripcion || 'Transferencia';
              const queryMovimiento = `INSERT INTO movimientos (id_cuenta, id_destino, monto, concepto, descripcion) 
                                        VALUES (?, ?, ?, ?, ?)`;

              db.query(queryMovimiento, [fromUserId, toUserId, amount, concepto, descripcionFinal], (err) => {
                if (err) {
                  return db.rollback(() => {
                    res.status(500).json({ message: 'Error al registrar el movimiento.' });
                  });
                }

                db.commit((err) => {
                  if (err) {
                    return db.rollback(() => {
                      res.status(500).json({ message: 'Error al finalizar la transacción.' });
                    });
                  }

                  res.status(200).json({ message: 'Transferencia realizada con éxito.' });
                });
              });
            });
          });
        });
      });
    });
  } catch (error) {
    console.error(error.message);

    res.status(400).json({ message: error.message || 'Error interno del servidor.' });
  }
};
module.exports = { transferFunds };