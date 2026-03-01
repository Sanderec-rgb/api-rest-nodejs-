/**
 * Rutas para el módulo de Tipos
 */

const express = require('express');
const router = express.Router();
const tipoController = require('../controllers/tipoController');

router.use((req, res, next) => {
    console.log(`🔸 Ruta de tipos: ${req.method} ${req.url}`);
    next();
});

router.get('/', tipoController.getAllTipos);
router.get('/:id', tipoController.getTipoById);
router.post('/', tipoController.createTipo);
router.put('/:id', tipoController.updateTipo);
router.delete('/:id', tipoController.deleteTipo);

module.exports = router;