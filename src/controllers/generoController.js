/**
 * Controlador para el módulo de Géneros
 */

const Database = require('../models/db');

// Obtener todos los géneros
exports.getAllGeneros = async (req, res) => {
    try {
        const generos = await Database.getAllGeneros();
        res.json({
            success: true,
            count: generos.length,
            data: generos
        });
    } catch (error) {
        console.error('Error en getAllGeneros:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los géneros',
            error: error.message
        });
    }
};

// Obtener un género por ID
exports.getGeneroById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido'
            });
        }

        const genero = await Database.getGeneroById(id);
        
        if (!genero) {
            return res.status(404).json({
                success: false,
                message: `Género con ID ${id} no encontrado`
            });
        }

        res.json({
            success: true,
            data: genero
        });
    } catch (error) {
        console.error('Error en getGeneroById:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el género',
            error: error.message
        });
    }
};

// Crear un nuevo género
exports.createGenero = async (req, res) => {
    try {
        const { nombre } = req.body;

        // Validaciones
        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: 'El nombre del género es requerido'
            });
        }

        if (nombre.length < 3) {
            return res.status(400).json({
                success: false,
                message: 'El nombre debe tener al menos 3 caracteres'
            });
        }

        const id = await Database.createGenero({ nombre });
        
        res.status(201).json({
            success: true,
            message: 'Género creado exitosamente',
            data: {
                id,
                nombre
            }
        });
    } catch (error) {
        console.error('Error en createGenero:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear el género',
            error: error.message
        });
    }
};

// Actualizar un género
exports.updateGenero = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        // Validaciones
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido'
            });
        }

        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: 'El nombre del género es requerido'
            });
        }

        const affectedRows = await Database.updateGenero(id, { nombre });
        
        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: `Género con ID ${id} no encontrado`
            });
        }

        res.json({
            success: true,
            message: 'Género actualizado exitosamente',
            data: {
                id: parseInt(id),
                nombre
            }
        });
    } catch (error) {
        console.error('Error en updateGenero:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el género',
            error: error.message
        });
    }
};

// Eliminar un género (borrado lógico)
exports.deleteGenero = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido'
            });
        }

        const affectedRows = await Database.deleteGenero(id);
        
        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: `Género con ID ${id} no encontrado`
            });
        }

        res.json({
            success: true,
            message: 'Género eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error en deleteGenero:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el género',
            error: error.message
        });
    }
};