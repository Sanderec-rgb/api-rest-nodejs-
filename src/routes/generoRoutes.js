/**
 * Rutas para el módulo de Géneros
 */

const express = require('express');
const router = express.Router();
const generoController = require('../controllers/generoController');

// Middleware específico para esta ruta
router.use((req, res, next) => {
    console.log(`🔸 Ruta de géneros: ${req.method} ${req.url}`);
    next();
});

// Definición de rutas
router.get('/', generoController.getAllGeneros);
router.get('/:id', generoController.getGeneroById);
router.post('/', generoController.createGenero);
router.put('/:id', generoController.updateGenero);
router.delete('/:id', generoController.deleteGenero);

module.exports = router;