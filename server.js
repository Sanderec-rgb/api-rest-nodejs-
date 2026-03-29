/**
 * Archivo principal del servidor
 * API REST - Sistema de Gestión de Películas
 * Autor: SANDER ENRIQUE CAMARGO OROZCO 
 * Fecha: 2026
 */

const app = require('./src/app');
require('dotenv').config();

// En Render, process.env.PORT es asignado automáticamente.
// Usamos '0.0.0.0' para que el servicio sea accesible externamente.
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; 
const NODE_ENV = process.env.NODE_ENV || 'development';

// Manejo de errores no capturados (Global)
process.on('uncaughtException', (error) => {
    console.error('❌ CRITICAL: Error no capturado:', error.message);
    console.error(error.stack);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ CRITICAL: Promesa rechazada no manejada en:', promise, 'razón:', reason);
    process.exit(1);
});

console.log('=================================');
console.log('🚀 API REST - Sistema de Películas');
console.log('=================================');
console.log(`📡 Intentando iniciar en: http://${HOST}:${PORT}`);
console.log(`🔧 Entorno: ${NODE_ENV}`);
console.log('=================================');

// Iniciar servidor especificando HOST y PORT para compatibilidad con la nube
const server = app.listen(PORT, HOST, () => {
    console.log('✨ Servidor desplegado correctamente');
    console.log(`✅ Acceso público listo en el puerto: ${PORT}`);
});

// Manejo de cierre Graceful (Para actualizaciones en Render sin interrumpir tráfico)
process.on('SIGTERM', () => {
    console.log('🛑 Recibida señal SIGTERM. Cerrando servidor de forma segura...');
    server.close(() => {
        console.log('✅ Todos los procesos terminados. Servidor cerrado.');
        process.exit(0);
    });
});

module.exports = server;