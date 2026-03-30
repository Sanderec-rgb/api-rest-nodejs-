const Database = require('../models/db');

exports.getAllMedia = async (req, res) => {
    try {
        console.log('🎯 GET /api/media');
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

exports.getMediaById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🎯 GET /api/media/${id}`);
        
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

exports.getMediaByTipo = async (req, res) => {
    try {
        const { tipo } = req.params;
        console.log(`🎯 GET /api/media/tipo/${tipo}`);
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

exports.createMedia = async (req, res) => {
    try {
        const { serial, titulo, sinopsis, url_pelicula, anio_estreno, id_genero, id_director, id_productora, id_tipo } = req.body;
        
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

exports.updateMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const mediaData = req.body;

        const existe = await Database.getMediaById(id);
        if (!existe) {
            return res.status(404).json({
                success: false,
                message: `Contenido con ID ${id} no encontrado`
            });
        }

        await Database.updateMedia(id, mediaData);
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

exports.deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;

        const existe = await Database.getMediaById(id);
        if (!existe) {
            return res.status(404).json({
                success: false,
                message: `Contenido con ID ${id} no encontrado`
            });
        }

        await Database.deleteMedia(id);

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