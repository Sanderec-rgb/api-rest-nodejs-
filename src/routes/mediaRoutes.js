/**
 * Rutas para el módulo de Media (Películas y Series)
 */

const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');

router.use((req, res, next) => {
    console.log(`🔸 Ruta de media: ${req.method} ${req.url}`);
    next();
});

// Rutas específicas primero
router.get('/tipo/:tipo', mediaController.getMediaByTipo);

// Rutas estándar
router.get('/', mediaController.getAllMedia);
router.get('/:id', mediaController.getMediaById);
router.post('/', mediaController.createMedia);
router.put('/:id', mediaController.updateMedia);
router.delete('/:id', mediaController.deleteMedia);

module.exports = router;