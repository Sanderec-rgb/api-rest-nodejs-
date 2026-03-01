/**
 * Configuración de la conexión a MySQL
 */

const mysql = require('mysql2');
require('dotenv').config();

// Crear pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cine_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Obtener promesa para usar async/await
const promisePool = pool.promise();

// Probar conexión inicial
(async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('✅ Conexión a MySQL establecida correctamente');
        console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
        connection.release();
    } catch (error) {
        console.error('❌ Error al conectar a MySQL:', error.message);
        console.log('⚠️  Asegúrate de que XAMPP con MySQL esté corriendo');
    }
})();

module.exports = promisePool;