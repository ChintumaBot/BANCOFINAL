const express = require('express');
const router = express.Router();
const db = require('../db'); 

router.post('/movimientos', async (req, res) => {
    const { userId } = req.body;
  
    try {
        const query = `
        SELECT 
          m.*, 
          c1.nombre AS nombre_emisor, 
          c2.nombre AS nombre_receptor 
        FROM 
          movimientos m
        LEFT JOIN 
          cuentas c1 ON m.id_cuenta = c1.id
        LEFT JOIN 
          cuentas c2 ON m.id_destino = c2.id
        WHERE 
          m.id_cuenta = ? OR m.id_destino = ?
        ORDER BY 
          m.fecha DESC
      `;
  
      db.query(query, [userId, userId], (error, results) => {
        if (error) {
          console.error('Error al obtener movimientos:', error);
          return res.status(500).json({ success: false, message: 'Error al obtener movimientos' });
        }
  
        const movimientosConNombres = results.map((movimiento) => {
          let nombre = 'Desconocido';
          if (movimiento.id_cuenta === userId) {
            nombre = movimiento.nombre_receptor || 'Desconocido';
          } else if (movimiento.id_destino === userId) {
            nombre = movimiento.nombre_emisor || 'Desconocido';
          }
          return {
            ...movimiento,
            nombre,
          };
        });
  
        res.json({ success: true, movimientos: movimientosConNombres });
      });
    } catch (error) {
      console.error('Error inesperado:', error);
      res.status(500).json({ success: false, message: 'Error al obtener movimientos' });
    }
});  

module.exports = router;