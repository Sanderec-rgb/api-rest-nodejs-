/**
 * Controlador para el módulo de Directores
 */

const Database = require('../models/db');

// Obtener todos los directores
exports.getAllDirectores = async (req, res) => {
    try {
        const directores = await Database.getAllDirectores();
        res.json({
            success: true,
            count: directores.length,
            data: directores
        });
    } catch (error) {
        console.error('Error en getAllDirectores:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los directores',
            error: error.message
        });
    }
};

// Obtener un director por ID
exports.getDirectorById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido'
            });
        }

        const director = await Database.getDirectorById(id);
        
        if (!director) {
            return res.status(404).json({
                success: false,
                message: `Director con ID ${id} no encontrado`
            });
        }

        res.json({
            success: true,
            data: director
        });
    } catch (error) {
        console.error('Error en getDirectorById:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el director',
            error: error.message
        });
    }
};

// Crear un nuevo director
exports.createDirector = async (req, res) => {
    try {
        const { nombres, apellidos, nacionalidad } = req.body;

        // Validaciones
        if (!nombres || !apellidos) {
            return res.status(400).json({
                success: false,
                message: 'Los nombres y apellidos son requeridos'
            });
        }

        if (nombres.length < 2 || apellidos.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Nombres y apellidos deben tener al menos 2 caracteres'
            });
        }

        const id = await Database.createDirector({ 
            nombres, 
            apellidos, 
            nacionalidad: nacionalidad || null 
        });
        
        res.status(201).json({
            success: true,
            message: 'Director creado exitosamente',
            data: {
                id,
                nombres,
                apellidos,
                nacionalidad: nacionalidad || 'No especificada'
            }
        });
    } catch (error) {
        console.error('Error en createDirector:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear el director',
            error: error.message
        });
    }
};

// Actualizar un director
exports.updateDirector = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombres, apellidos, nacionalidad } = req.body;

        // Validaciones
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido'
            });
        }

        if (!nombres || !apellidos) {
            return res.status(400).json({
                success: false,
                message: 'Los nombres y apellidos son requeridos'
            });
        }

        const affectedRows = await Database.updateDirector(id, { 
            nombres, 
            apellidos, 
            nacionalidad 
        });
        
        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: `Director con ID ${id} no encontrado`
            });
        }

        res.json({
            success: true,
            message: 'Director actualizado exitosamente',
            data: {
                id: parseInt(id),
                nombres,
                apellidos,
                nacionalidad
            }
        });
    } catch (error) {
        console.error('Error en updateDirector:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el director',
            error: error.message
        });
    }
};

// Eliminar un director (borrado lógico)
exports.deleteDirector = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido'
            });
        }

        const affectedRows = await Database.deleteDirector(id);
        
        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: `Director con ID ${id} no encontrado`
            });
        }

        res.json({
            success: true,
            message: 'Director eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error en deleteDirector:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el director',
            error: error.message
        });
    }
};