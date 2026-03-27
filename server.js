/**
 * Archivo principal del servidor
 * API REST - Sistema de Gestión de Películas
 * Autor: SANDER ENRIQUE CAMARGO OROZCO 
 * Fecha: 2026
 */

const app = require('./src/app');
const { inicializarBaseDatos } = require('./src/config/database');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
    console.error('❌ Error no capturado:', error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ Promesa rechazada no manejada:', error);
    process.exit(1);
});

/**
 * Función principal para iniciar el servidor
 * Inicializa la base de datos antes de arrancar el servidor
 */
async function startServer() {
    try {
        console.log('=================================');
        console.log('🚀 API REST - Sistema de Películas');
        console.log('=================================');
        console.log('🔧 Inicializando sistema...');
        
        // Inicializar base de datos (crea tablas y datos si no existen)
        await inicializarBaseDatos();
        console.log('✅ Base de datos lista');
        
        // Iniciar servidor
        const server = app.listen(PORT, () => {
            console.log(`📡 Servidor: http://localhost:${PORT}`);
            console.log(`🔧 Entorno: ${NODE_ENV}`);
            console.log(`📚 Documentación: http://localhost:${PORT}/api-docs`);
            console.log('=================================');
            console.log('✨ Servidor listo para recibir peticiones');
        });
        
        // Manejo de cierre graceful
        process.on('SIGTERM', () => {
            console.log('🛑 Recibida señal SIGTERM. Cerrando servidor...');
            server.close(() => {
                console.log('✅ Servidor cerrado correctamente');
                process.exit(0);
            });
        });
        
        return server;
        
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error.message);
        console.error('💡 Verifica la conexión a la base de datos');
        process.exit(1);
    }
}

// Iniciar la aplicación
startServer();

module.exports = startServer;