const mysql = require('mysql2');
require('dotenv').config();

// Configuración para MySQL en XAMPP
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '', // XAMPP suele no tener contraseña
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convertimos el pool para usar Promesas (async/await)
const promisePool = pool.promise();

// Verificamos la conexión manualmente al arrancar
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error al conectar a MySQL (XAMPP):', err.message);
    } else {
        console.log('✅ Conexión a MySQL establecida correctamente');
        console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
        connection.release(); // Importante liberar la conexión de prueba
    }
});

module.exports = promisePool;