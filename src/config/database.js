const mysql = require('mysql2');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Configuración del Pool
const pool = mysql.createPool({
    host: process.env.TIDB_HOST,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    port: process.env.TIDB_PORT || 4000,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // SSL es obligatorio para TiDB Cloud
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    }
});

// Verificación de logs para Render
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ ERROR DB:', err.message);
    } else {
        console.log('✅ DB CONECTADA (SSL)');
        connection.release();
    }
});

module.exports = pool.promise();