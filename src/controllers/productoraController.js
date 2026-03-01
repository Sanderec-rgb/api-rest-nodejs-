/**
 * Controlador para el módulo de Productoras
 */

const Database = require('../models/db');

// Obtener todas las productoras
exports.getAllProductoras = async (req, res) => {
    try {
        const productoras = await Database.getAllProductoras();
        res.json({
            success: true,
            count: productoras.length,
            data: productoras
        });
    } catch (error) {
        console.error('Error en getAllProductoras:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las productoras',
            error: error.message
        });
    }
};

// Obtener una productora por ID
exports.getProductoraById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido'
            });
        }

        const productora = await Database.getProductoraById(id);
        
        if (!productora) {
            return res.status(404).json({
                success: false,
                message: `Productora con ID ${id} no encontrada`
            });
        }

        res.json({
            success: true,
            data: productora
        });
    } catch (error) {
        console.error('Error en getProductoraById:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la productora',
            error: error.message
        });
    }
};

// Crear una nueva productora
exports.createProductora = async (req, res) => {
    try {
        const { nombre, sede_social } = req.body;

        // Validaciones
        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: 'El nombre de la productora es requerido'
            });
        }

        if (nombre.length < 3) {
            return res.status(400).json({
                success: false,
                message: 'El nombre debe tener al menos 3 caracteres'
            });
        }

        const id = await Database.createProductora({ 
            nombre, 
            sede_social: sede_social || null 
        });
        
        res.status(201).json({
            success: true,
            message: 'Productora creada exitosamente',
            data: {
                id,
                nombre,
                sede_social: sede_social || 'No especificada'
            }
        });
    } catch (error) {
        console.error('Error en createProductora:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear la productora',
            error: error.message
        });
    }
};

// Actualizar una productora
exports.updateProductora = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, sede_social } = req.body;

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
                message: 'El nombre de la productora es requerido'
            });
        }

        const affectedRows = await Database.updateProductora(id, { 
            nombre, 
            sede_social 
        });
        
        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: `Productora con ID ${id} no encontrada`
            });
        }

        res.json({
            success: true,
            message: 'Productora actualizada exitosamente',
            data: {
                id: parseInt(id),
                nombre,
                sede_social
            }
        });
    } catch (error) {
        console.error('Error en updateProductora:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la productora',
            error: error.message
        });
    }
};

// Eliminar una productora (borrado lógico)
exports.deleteProductora = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido'
            });
        }

        const affectedRows = await Database.deleteProductora(id);
        
        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: `Productora con ID ${id} no encontrada`
            });
        }

        res.json({
            success: true,
            message: 'Productora eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error en deleteProductora:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la productora',
            error: error.message
        });
    }
};