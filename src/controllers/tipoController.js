/**
 * Controlador para el módulo de Tipos (Película/Serie)
 */

const Database = require('../models/db');

// Obtener todos los tipos
exports.getAllTipos = async (req, res) => {
    try {
        const tipos = await Database.getAllTipos();
        res.json({
            success: true,
            count: tipos.length,
            data: tipos
        });
    } catch (error) {
        console.error('Error en getAllTipos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los tipos',
            error: error.message
        });
    }
};

// Obtener un tipo por ID
exports.getTipoById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido'
            });
        }

        const tipo = await Database.getTipoById(id);
        
        if (!tipo) {
            return res.status(404).json({
                success: false,
                message: `Tipo con ID ${id} no encontrado`
            });
        }

        res.json({
            success: true,
            data: tipo
        });
    } catch (error) {
        console.error('Error en getTipoById:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el tipo',
            error: error.message
        });
    }
};

// Crear un nuevo tipo
exports.createTipo = async (req, res) => {
    try {
        const { nombre } = req.body;

        // Validaciones
        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: 'El nombre del tipo es requerido'
            });
        }

        if (nombre.length < 3) {
            return res.status(400).json({
                success: false,
                message: 'El nombre debe tener al menos 3 caracteres'
            });
        }

        const id = await Database.createTipo({ nombre });
        
        res.status(201).json({
            success: true,
            message: 'Tipo creado exitosamente',
            data: {
                id,
                nombre
            }
        });
    } catch (error) {
        console.error('Error en createTipo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear el tipo',
            error: error.message
        });
    }
};

// Actualizar un tipo
exports.updateTipo = async (req, res) => {
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
                message: 'El nombre del tipo es requerido'
            });
        }

        const affectedRows = await Database.updateTipo(id, { nombre });
        
        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: `Tipo con ID ${id} no encontrado`
            });
        }

        res.json({
            success: true,
            message: 'Tipo actualizado exitosamente',
            data: {
                id: parseInt(id),
                nombre
            }
        });
    } catch (error) {
        console.error('Error en updateTipo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el tipo',
            error: error.message
        });
    }
};

// Eliminar un tipo (borrado lógico)
exports.deleteTipo = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido'
            });
        }

        const affectedRows = await Database.deleteTipo(id);
        
        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: `Tipo con ID ${id} no encontrado`
            });
        }

        res.json({
            success: true,
            message: 'Tipo eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error en deleteTipo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el tipo',
            error: error.message
        });
    }
};