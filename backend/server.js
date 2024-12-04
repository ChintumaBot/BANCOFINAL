const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/register', async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});