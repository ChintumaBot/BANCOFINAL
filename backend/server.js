const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const { transferFunds, checkTransferStatus, actualizarEstado } = require('./routes/transfer');
const saldoRouter = require('./routes/saldo');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.post('/api/transfer', transferFunds);
app.post('/api/transferencia/verificar', checkTransferStatus);
app.post('/api/transferencia/actualizar', actualizarEstado); 
app.use('/api', saldoRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});