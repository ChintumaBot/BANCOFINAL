const express = require('express');
const router = express.Router();
const db = require('../db'); // Asegúrate de tener la conexión configurada correctamente

router.post('/saldo', (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'El ID de usuario es obligatorio',
    });
  }

  const query = 'SELECT saldo, nombre FROM cuentas WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error al obtener el saldo',
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    const user = results[0];

    return res.status(200).json({
      success: true,
      message: 'Saldo obtenido con éxito',
      user: {
        id: userId,
        nombre: user.nombre,
        saldo: user.saldo,
      },
    });
  });
});

module.exports = router;