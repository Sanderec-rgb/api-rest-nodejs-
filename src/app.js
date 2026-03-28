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

// ============================================
// ENDPOINT DE DIAGNÓSTICO (AGREGADO)
// ============================================
app.get('/api/test-db', async (req, res) => {
    try {
        const pool = require('./config/database');
        const result = await pool.query(`
            SELECT 
                NOW() as hora,
                (SELECT COUNT(*) FROM genero) as total_generos,
                (SELECT COUNT(*) FROM director) as total_directores,
                (SELECT COUNT(*) FROM productora) as total_productoras,
                (SELECT COUNT(*) FROM tipo) as total_tipos,
                (SELECT COUNT(*) FROM media) as total_media
        `);
        res.json({
            success: true,
            message: '✅ Conexión exitosa a PostgreSQL',
            data: result.rows[0],
            env: {
                DB_HOST: process.env.DB_HOST,
                DB_USER: process.env.DB_USER,
                DB_NAME: process.env.DB_NAME,
                DB_PORT: process.env.DB_PORT,
                NODE_ENV: process.env.NODE_ENV
            }
        });
    } catch (error) {
        console.error('❌ Error en test-db:', error);
        res.status(500).json({
            success: false,
            message: 'Error de conexión a base de datos',
            error: error.message,
            code: error.code,
            stack: error.stack
        });
    }
});
// ============================================

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

// Manejo de rutas no encontradas
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