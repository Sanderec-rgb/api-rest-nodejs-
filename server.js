const app = require('./src/app');
require('dotenv').config();

const PORT = parseInt(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

console.log('=================================');
console.log('🚀 API REST - Sistema de Películas');
console.log('=================================');
console.log(`📡 Puerto: ${PORT}`);
console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
console.log('=================================');

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
    console.error('❌ Error no capturado:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('❌ Promesa rechazada:', reason);
    process.exit(1);
});

// Iniciar servidor
const server = app.listen(PORT, HOST, () => {
    console.log(`✅ Servidor corriendo en http://${HOST}:${PORT}`);
    if (process.env.RENDER_EXTERNAL_URL) {
        console.log(`🌐 URL pública: ${process.env.RENDER_EXTERNAL_URL}`);
    }
});

// Cierre graceful
const gracefulShutdown = () => {
    console.log('🛑 Cerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado');
        process.exit(0);
    });
    
    setTimeout(() => {
        console.error('⚠️ Timeout, forzando cierre');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = server;