/**
 * Rutas para el módulo de Productoras
 */

const express = require('express');
const router = express.Router();
const productoraController = require('../controllers/productoraController');

router.use((req, res, next) => {
    console.log(`🔸 Ruta de productoras: ${req.method} ${req.url}`);
    next();
});

router.get('/', productoraController.getAllProductoras);
router.get('/:id', productoraController.getProductoraById);
router.post('/', productoraController.createProductora);
router.put('/:id', productoraController.updateProductora);
router.delete('/:id', productoraController.deleteProductora);

module.exports = router;