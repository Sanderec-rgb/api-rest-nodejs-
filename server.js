const app = require('./src/app');
require('dotenv').config();

const PORT = parseInt(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
    console.error('❌ Error no capturado:', error);
    console.error('Stack:', error.stack);
    // En producción, no hacer exit(1) inmediatamente
    if (process.env.NODE_ENV === 'production') {
        console.error('⚠️ Error no fatal, continuando...');
    } else {
        process.exit(1);
    }
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada no manejada:');
    console.error('Razón:', reason);
    console.error('Promesa:', promise);
});

console.log('=================================');
console.log('🚀 API REST - Sistema de Películas');
console.log('=================================');
console.log(`📡 Puerto: ${PORT}`);
console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
console.log(`🕐 Inicio: ${new Date().toISOString()}`);
console.log('=================================');

// Iniciar servidor
const server = app.listen(PORT, HOST, () => {
    console.log(`✅ Servidor corriendo en http://${HOST}:${PORT}`);
    console.log(`🌐 URL pública: ${process.env.RENDER_EXTERNAL_URL || 'No disponible'}`);
});

// Cierre graceful para Render
const gracefulShutdown = () => {
    console.log('🛑 Recibida señal de cierre. Cerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
    });

    // Forzar cierre después de 10 segundos
    setTimeout(() => {
        console.error('⚠️ Timeout de cierre, forzando salida');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = server;