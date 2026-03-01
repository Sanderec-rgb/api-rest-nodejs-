/**
 * Configuración principal de la aplicación Express
 */

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

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para logging de peticiones
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// Rutas de la API
app.use('/api/generos', generoRoutes);
app.use('/api/directores', directorRoutes);
app.use('/api/productoras', productoraRoutes);
app.use('/api/tipos', tipoRoutes);
app.use('/api/media', mediaRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🎬 API REST - Sistema de Gestión de Películas',
        version: '1.0.0',
        author: 'SANDER ENRIQUE CAMARGO OROZCO',
        fecha: new Date().toLocaleDateString('es-CO'),
        documentacion: '/api-docs',
        endpoints: {
            generos: {
                url: '/api/generos',
                metodos: ['GET', 'POST', 'PUT', 'DELETE'],
                descripcion: 'Gestión de géneros cinematográficos'
            },
            directores: {
                url: '/api/directores',
                metodos: ['GET', 'POST', 'PUT', 'DELETE'],
                descripcion: 'Gestión de directores'
            },
            productoras: {
                url: '/api/productoras',
                metodos: ['GET', 'POST', 'PUT', 'DELETE'],
                descripcion: 'Gestión de productoras'
            },
            tipos: {
                url: '/api/tipos',
                metodos: ['GET', 'POST', 'PUT', 'DELETE'],
                descripcion: 'Gestión de tipos (Película/Serie)'
            },
            media: {
                url: '/api/media',
                metodos: ['GET', 'POST', 'PUT', 'DELETE'],
                descripcion: 'Gestión de películas y series'
            }
        }
    });
});

// Ruta de documentación básica
app.get('/api-docs', (req, res) => {
    res.json({
        success: true,
        title: 'Documentación de la API',
        description: 'Endpoints disponibles para pruebas con Postman',
        base_url: `http://localhost:${process.env.PORT || 3000}`,
        ejemplos: {
            crear_genero: {
                method: 'POST',
                url: '/api/generos',
                body: {
                    nombre: "Acción"
                }
            },
            crear_director: {
                method: 'POST',
                url: '/api/directores',
                body: {
                    nombres: "Christopher",
                    apellidos: "Nolan",
                    nacionalidad: "Británica"
                }
            },
            crear_media: {
                method: 'POST',
                url: '/api/media',
                body: {
                    serial: "MOV001",
                    titulo: "Inception",
                    sinopsis: "Un ladrón que roba secretos corporativos...",
                    anio_estreno: 2010,
                    id_genero: 1,
                    id_director: 1,
                    id_productora: 1,
                    id_tipo: 1
                }
            }
        }
    });
});

// Ruta de prueba de conexión
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'OK',
        timestamp: new Date(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
});

// Manejo de rutas no encontradas - CORREGIDO
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        error: `No se encontró ${req.method} ${req.originalUrl}`,
        disponibles: {
            generos: '/api/generos',
            directores: '/api/directores',
            productoras: '/api/productoras',
            tipos: '/api/tipos',
            media: '/api/media'
        }
    });
});

module.exports = app;