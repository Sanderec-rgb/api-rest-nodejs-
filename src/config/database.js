/**
 * Configuración de conexión a la Base de Datos (TiDB Cloud / MySQL)
 * Se requiere SSL para conexiones seguras en la nube.
 */
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const pool = mysql.createPool({
    host: process.env.TIDB_HOST,
    user: process.env.process.env.TIDB_USER || process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    port: process.env.TIDB_PORT || 4000,
    
    // Configuración del Pool para optimizar el rendimiento en Render
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    
    // 🛡️ SEGURIDAD SSL: Obligatorio para TiDB Cloud Serverless
    // Esto evita el error "Connections using insecure transport are prohibited"
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    }
});

// Verificación inicial de conexión para los logs de Render
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error crítico de conexión a la Base de Datos Cloud:', err.message);
    } else {
        console.log('✅ Conexión exitosa a TiDB Cloud (SSL Activo)');
        connection.release();
    }
});

// Exportamos el pool con soporte para Promesas para que funcione con tu Database.js
module.exports = pool.promise();