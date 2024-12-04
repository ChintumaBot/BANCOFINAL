const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { nombre, apellido_p, apellido_m, correo, password } = req.body;

  if (!nombre || !apellido_p || !apellido_m || !correo || !password) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO cuentas (nombre, apellido_paterno, apellido_materno, correo, password) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [nombre, apellido_p, apellido_m, correo, hashedPassword], (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
        }
        return res.status(500).json({ success: false, message: 'Error en el servidor' });
      }
      res.status(201).json({ success: true, message: 'Usuario registrado exitosamente' });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

router.post('/login', (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
  }

  const query = 'SELECT * FROM cuentas WHERE correo = ?';
  db.query(query, [correo], async (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(400).json({ success: false, message: 'Correo o contraseña incorrectos' });
    }

    const user = results[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ success: false, message: 'Correo o contraseña incorrectos' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido_p: user.apellido_paterno,
        apellido_m: user.apellido_materno,
        correo: user.correo,
        saldo: user.saldo,
      },
    });
  });
});

module.exports = router;