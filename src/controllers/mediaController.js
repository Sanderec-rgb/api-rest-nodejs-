const Database = require('../models/db');

// Obtener todo el contenido multimedia
exports.getAllMedia = async (req, res) => {
    try {
        console.log('🎯 getAllMedia fue llamado');
        const media = await Database.getAllMedia();
        console.log(`✅ Encontrados ${media.length} registros`);
        res.json({
            success: true,
            count: media.length,
            data: media
        });
    } catch (error) {
        console.error('Error en getAllMedia:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el contenido multimedia',
            error: error.message
        });
    }
};

// Obtener contenido multimedia por ID
exports.getMediaById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido'
            });
        }

        const media = await Database.getMediaById(id);
        
        if (!media) {
            return res.status(404).json({
                success: false,
                message: `Contenido con ID ${id} no encontrado`
            });
        }

        res.json({
            success: true,
            data: media
        });
    } catch (error) {
        console.error('Error en getMediaById:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el contenido',
            error: error.message
        });
    }
};

// Crear nuevo contenido multimedia
exports.createMedia = async (req, res) => {
    try {
        const { 
            serial, titulo, sinopsis, url_pelicula, 
            anio_estreno, id_genero, id_director, 
            id_productora, id_tipo 
        } = req.body;

        if (!serial || !titulo) {
            return res.status(400).json({
                success: false,
                message: 'El serial y título son requeridos'
            });
        }

        const id = await Database.createMedia({
            serial, titulo, sinopsis, url_pelicula, anio_estreno,
            id_genero, id_director, id_productora, id_tipo
        });

        const nuevoMedia = await Database.getMediaById(id);

        res.status(201).json({
            success: true,
            message: 'Contenido multimedia creado exitosamente',
            data: nuevoMedia
        });
    } catch (error) {
        console.error('Error en createMedia:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear el contenido multimedia',
            error: error.message
        });
    }
};

// Actualizar contenido multimedia
exports.updateMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const mediaData = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido'
            });
        }

        const existe = await Database.getMediaById(id);
        if (!existe) {
            return res.status(404).json({
                success: false,
                message: `Contenido con ID ${id} no encontrado`
            });
        }

        const affectedRows = await Database.updateMedia(id, mediaData);
        
        const mediaActualizado = await Database.getMediaById(id);

        res.json({
            success: true,
            message: 'Contenido multimedia actualizado exitosamente',
            data: mediaActualizado
        });
    } catch (error) {
        console.error('Error en updateMedia:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el contenido multimedia',
            error: error.message
        });
    }
};

// Eliminar contenido multimedia
exports.deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido'
            });
        }

        const existe = await Database.getMediaById(id);
        if (!existe) {
            return res.status(404).json({
                success: false,
                message: `Contenido con ID ${id} no encontrado`
            });
        }

        const affectedRows = await Database.deleteMedia(id);

        res.json({
            success: true,
            message: 'Contenido multimedia eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error en deleteMedia:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el contenido multimedia',
            error: error.message
        });
    }
};

// Obtener contenido por tipo
exports.getMediaByTipo = async (req, res) => {
    try {
        const { tipo } = req.params;
        const todoMedia = await Database.getAllMedia();
        
        const filtrado = todoMedia.filter(item => 
            item.tipo_nombre && item.tipo_nombre.toLowerCase() === tipo.toLowerCase()
        );

        res.json({
            success: true,
            tipo: tipo,
            count: filtrado.length,
            data: filtrado
        });
    } catch (error) {
        console.error('Error en getMediaByTipo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al filtrar contenido por tipo',
            error: error.message
        });
    }
};