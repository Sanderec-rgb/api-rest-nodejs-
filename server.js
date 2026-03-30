const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

console.log('=================================');
console.log('🚀 Iniciando servidor...');
console.log('=================================');

// Manejo de errores
process.on('uncaughtException', (error) => {
    console.error('❌ Error no capturado:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada:', reason);
    process.exit(1);
});

// Iniciar servidor
const server = app.listen(PORT, HOST, () => {
    console.log(`✅ Servidor corriendo en http://${HOST}:${PORT}`);
    console.log(`🌐 URL: https://api-rest-nodejs-5.onrender.com`);
});

// Cierre graceful
process.on('SIGTERM', () => {
    console.log('🛑 Cerrando servidor...');
    server.close(() => process.exit(0));
});

module.exports = server;