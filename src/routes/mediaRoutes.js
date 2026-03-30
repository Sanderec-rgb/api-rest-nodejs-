/**
 * Rutas para el módulo de Media (Películas y Series)
 */

const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');

// Middleware de logging para debugging
router.use((req, res, next) => {
    console.log(`🔸 Ruta de media: ${req.method} ${req.originalUrl}`);
    next();
});

// IMPORTANTE: Las rutas específicas DEBEN ir ANTES que las rutas con parámetros
// De lo contrario, /tipo/:tipo sería interpretado como /:id

// Rutas específicas (sin parámetros de ID)
router.get('/tipo/:tipo', mediaController.getMediaByTipo);

// Rutas con parámetros
router.get('/:id', mediaController.getMediaById);
router.put('/:id', mediaController.updateMedia);
router.delete('/:id', mediaController.deleteMedia);

// Rutas estándar (deben ir al final)
router.get('/', mediaController.getAllMedia);
router.post('/', mediaController.createMedia);

module.exports = router;