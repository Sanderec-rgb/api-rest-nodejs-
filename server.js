/**
 * Archivo principal del servidor
 * API REST - Sistema de Gestión de Películas
 * Autor: SANDER ENRIQUE CAMARGO OROZCO 
 * Fecha: 2026
 */

const app = require('./src/app');
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

console.log('=================================');
console.log('🚀 API REST - Sistema de Películas');
console.log('=================================');
console.log(`📡 Servidor en puerto: ${PORT}`);
console.log(`🔧 Entorno: ${NODE_ENV}`);
console.log('=================================');

// Iniciar servidor
const server = app.listen(PORT, () => {
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

module.exports = server;