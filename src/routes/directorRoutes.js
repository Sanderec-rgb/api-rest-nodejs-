/**
 * Rutas para el módulo de Directores
 */

const express = require('express');
const router = express.Router();
const directorController = require('../controllers/directorController');

router.use((req, res, next) => {
    console.log(`🔸 Ruta de directores: ${req.method} ${req.url}`);
    next();
});

router.get('/', directorController.getAllDirectores);
router.get('/:id', directorController.getDirectorById);
router.post('/', directorController.createDirector);
router.put('/:id', directorController.updateDirector);
router.delete('/:id', directorController.deleteDirector);

module.exports = router;