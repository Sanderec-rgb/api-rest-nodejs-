const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error al conectar a PostgreSQL:', err.message);
    } else {
        console.log('✅ Conexión a PostgreSQL establecida correctamente');
        console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
        release();
    }
});

module.exports = pool;