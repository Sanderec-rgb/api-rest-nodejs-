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
// ENDPOINT DE DIAGNÓSTICO
// ============================================
app.get('/api/test-db', async (req, res) => {
    try {
        const pool = require('./config/database');
        
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
            message: '✅ Conexión exitosa a TiDB',
            data: rows[0],
            env: {
                TIDB_HOST: process.env.TIDB_HOST ? '✓' : '✗',
                TIDB_USER: process.env.TIDB_USER ? '✓' : '✗',
                TIDB_DATABASE: process.env.TIDB_DATABASE ? '✓' : '✗',
                NODE_ENV: process.env.NODE_ENV || 'development'
            }
        });
    } catch (error) {
        console.error('❌ Error en test-db:', error);
        res.status(500).json({
            success: false,
            message: 'Error de conexión a base de datos',
            error: error.message
        });
    }
});

// ============================================

// Montar rutas
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
        endpoints: {
            generos: '/api/generos',
            directores: '/api/directores',
            productoras: '/api/productoras',
            tipos: '/api/tipos',
            media: '/api/media',
            test_db: '/api/test-db'
        }
    });
});

// Ruta de documentación
app.get('/api-docs', (req, res) => {
    res.json({
        success: true,
        title: 'Documentación de la API',
        base_url: process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000',
        ejemplos: {
            crear_genero: {
                method: 'POST',
                url: '/api/generos',
                body: { nombre: "Acción" }
            },
            crear_director: {
                method: 'POST',
                url: '/api/directores',
                body: { nombres: "Christopher", apellidos: "Nolan", nacionalidad: "Británica" }
            },
            crear_media: {
                method: 'POST',
                url: '/api/media',
                body: {
                    serial: "MOV099",
                    titulo: "Nueva Película",
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

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'OK',
        timestamp: new Date(),
        uptime: process.uptime()
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        path: req.originalUrl
    });
});

module.exports = app;