const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('🚀 Conectando a TiDB Cloud...');

const pool = mysql.createPool({
    host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
    user: '3MRLnH9cKXa2agS.root',
    password: 'U59kSxKwo9rItrNY',
    database: 'test',
    port: 4000,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
    waitForConnections: true,
    connectionLimit: 10
});

// Probar conexión
pool.getConnection()
    .then(conn => {
        console.log('✅ Conexión exitosa a TiDB');
        conn.release();
    })
    .catch(err => {
        console.error('❌ Error de conexión:', err.message);
        process.exit(1);
    });

module.exports = pool;