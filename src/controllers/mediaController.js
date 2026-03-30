// Obtener contenido por tipo
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