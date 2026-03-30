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
// ENDPOINT DE DIAGNÓSTICO CORREGIDO
// ============================================
app.get('/api/test-db', async (req, res) => {
    try {
        // Importar pool correctamente
        const pool = require('./config/database');
        
        // Usar sintaxis de MySQL/TiDB (no PostgreSQL)
        const [rows] = await pool.query(`
            SELECT 
                NOW() as hora,
                (SELECT COUNT(*) FROM genero WHERE estado = 1) as total_generos,
                (SELECT COUNT(*) FROM director WHERE estado = 1) as total_directores,
                (SELECT COUNT(*) FROM productora WHERE estado = 1) as total_productoras,
                (SELECT COUNT(*) FROM tipo WHERE estado = 1) as total_tipos,
                (SELECT COUNT(*) FROM media WHERE estado = 1) as total_media
        `);
        
        res.json({
            success: true,
            message: '✅ Conexión exitosa a TiDB/MySQL',
            data: rows[0], // En MySQL/TiDB es rows[0], no result.rows
            env: {
                TIDB_HOST: process.env.TIDB_HOST ? '✓ Configurado' : '✗ Faltante',
                TIDB_USER: process.env.TIDB_USER ? '✓ Configurado' : '✗ Faltante',
                TIDB_DATABASE: process.env.TIDB_DATABASE ? '✓ Configurado' : '✗ Faltante',
                TIDB_PORT: process.env.TIDB_PORT || 4000,
                NODE_ENV: process.env.NODE_ENV || 'development'
            }
        });
    } catch (error) {
        console.error('❌ Error en test-db:', error);
        res.status(500).json({
            success: false,
            message: 'Error de conexión a base de datos',
            error: error.message,
            code: error.code,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});
// ============================================

// Rutas de la API (NOTA: Ya están montadas con sus propias rutas base)
// En tus archivos de rutas, ya tienes definido, por ejemplo:
// generoRoutes: router.get('/') -> /api/generos
// Así que aquí solo montamos en /api
app.use('/api', generoRoutes);
app.use('/api', directorRoutes);
app.use('/api', productoraRoutes);
app.use('/api', tipoRoutes);
app.use('/api', mediaRoutes);

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
            },
            diagnostico: {
                url: '/api/test-db',
                metodo: 'GET',
                descripcion: 'Prueba de conexión a base de datos'
            },
            health: {
                url: '/api/health',
                metodo: 'GET',
                descripcion: 'Estado del servicio'
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
        base_url: `https://api-rest-nodejs-5.onrender.com`,
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
                    serial: "MOV099",
                    titulo: "Nueva Película",
                    sinopsis: "Sinopsis de prueba",
                    anio_estreno: 2024,
                    id_genero: 1,
                    id_director: 1,
                    id_productora: 1,
                    id_tipo: 1
                }
            }
        }
    });
});

// Ruta de prueba de conexión (health check)
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'OK',
        timestamp: new Date(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        database: 'Connected'
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
            media: '/api/media',
            diagnostico: '/api/test-db',
            health: '/api/health',
            documentacion: '/api-docs'
        }
    });
});

module.exports = app;