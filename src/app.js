const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const generoRoutes = require('./routes/generoRoutes');
const directorRoutes = require('./routes/directorRoutes');
const productoraRoutes = require('./routes/productoraRoutes');
const tipoRoutes = require('./routes/tipoRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

const app = express();

// Middlewares
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🎬 API REST - Sistema de Gestión de Películas',
        version: '1.0.0',
        endpoints: {
            media: '/api/media',
            generos: '/api/generos',
            directores: '/api/directores',
            productoras: '/api/productoras',
            tipos: '/api/tipos'
        }
    });
});

// Montar rutas
app.use('/api', mediaRoutes);
app.use('/api', generoRoutes);
app.use('/api', directorRoutes);
app.use('/api', productoraRoutes);
app.use('/api', tipoRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        path: req.originalUrl
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: err.message
    });
});

module.exports = app;