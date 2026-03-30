const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Verificar variables de entorno
if (!process.env.TIDB_HOST || !process.env.TIDB_USER || !process.env.TIDB_PASSWORD) {
    console.error('❌ ERROR: Variables de entorno faltantes');
    console.error('TIDB_HOST:', process.env.TIDB_HOST ? '✓ Configurado' : '✗ Faltante');
    console.error('TIDB_USER:', process.env.TIDB_USER ? '✓ Configurado' : '✗ Faltante');
    console.error('TIDB_PASSWORD:', process.env.TIDB_PASSWORD ? '✓ Configurado' : '✗ Faltante');
    console.error('TIDB_DATABASE:', process.env.TIDB_DATABASE ? '✓ Configurado' : '✗ Faltante');
    process.exit(1);
}

// Crear pool directamente con la versión de promesas
const pool = mysql.createPool({
    host: process.env.TIDB_HOST,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    port: parseInt(process.env.TIDB_PORT) || 4000,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    },
    connectTimeout: 10000,
    acquireTimeout: 10000
});

// Probar conexión
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión a base de datos exitosa (SSL activado)');
        
        const [rows] = await connection.query('SELECT VERSION() as version, DATABASE() as database');
        console.log(`📊 Versión: ${rows[0].version}`);
        console.log(`📊 Base de datos: ${rows[0].database}`);
        
        connection.release();
    } catch (error) {
        console.error('❌ Error de conexión a BD:', error.message);
        console.error('Detalles completos:', error);
        process.exit(1);
    }
};

testConnection();

// Exportar el pool directamente (ya es una promesa)
module.exports = pool;