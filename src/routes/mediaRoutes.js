const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');

// IMPORTANTE: Las rutas específicas DEBEN ir ANTES que las genéricas
router.get('/tipo/:tipo', mediaController.getMediaByTipo);

// Rutas con parámetro ID
router.get('/:id', mediaController.getMediaById);
router.put('/:id', mediaController.updateMedia);
router.delete('/:id', mediaController.deleteMedia);

// Rutas base
router.get('/', mediaController.getAllMedia);
router.post('/', mediaController.createMedia);

module.exports = router;