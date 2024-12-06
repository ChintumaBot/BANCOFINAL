const express = require('express');
const router = express.Router();
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
              const queryMovimiento = `INSERT INTO movimientos (id_cuenta, id_destino, monto, concepto, descripcion, estado) 
                                        VALUES (?, ?, ?, ?, ?, 'pendiente')`;

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

                  res.status(200).json({ success: true, message: 'Transferencia realizada con éxito.' });
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

const checkTransferStatus = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'El ID de la cuenta es obligatorio',
    });
  }

  try {
    const query = `
      SELECT 
        m.id,
        m.monto, 
        m.concepto, 
        m.descripcion, 
        m.estado,
        u.nombre AS remitente
      FROM 
        movimientos m
      JOIN 
        cuentas u ON m.id_cuenta = u.id -- Aquí unimos el remitente (id_cuenta)
      WHERE 
        m.id_destino = ? 
        AND m.estado = 'pendiente'
      ORDER BY 
        m.fecha DESC
      LIMIT 1;
    `;

    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err.message);
        return res.status(500).json({
          success: false,
          message: 'Error al verificar la transferencia',
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No se encontraron transferencias completadas para esta cuenta',
        });
      }

      const transferencia = results[0];
      return res.status(200).json({
        success: true,
        transferencia: {
          id: transferencia.id,
          remitente: transferencia.remitente,
          monto: transferencia.monto,
          concepto: transferencia.concepto,
          descripcion: transferencia.descripcion,
          estado: transferencia.estado,
        },
      });
    });
  } catch (error) {
    console.error('Error interno del servidor:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor.' 
    });
  }
};

const actualizarEstado = async (req, res) => {
  const { transferenciaId, estado } = req.body;

  if (!transferenciaId || !estado) {
    return res.status(400).json({ message: 'Datos inválidos.' });
  }

  const query = `UPDATE movimientos SET estado = ? WHERE id = ?`;

  db.query(query, [estado, transferenciaId], (err, results) => {
    if (err) {
      console.error('Error al actualizar el estado:', err.message);
      return res.status(500).json({ message: 'Error al actualizar el estado.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Transferencia no encontrada.' });
    }

    res.status(200).json({ success: true, message: 'Estado actualizado correctamente.' });
  });
};

module.exports = { transferFunds, checkTransferStatus, actualizarEstado };