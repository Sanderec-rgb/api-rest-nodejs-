const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('🚀 Iniciando conexión a base de datos...');
console.log(`📡 Entorno: ${process.env.NODE_ENV || 'development'}`);

let dbConfig;

// Detectar entorno
if (process.env.NODE_ENV === 'production' || process.env.TIDB_HOST) {
    console.log('✅ Usando configuración de PRODUCCIÓN (TiDB Cloud)');
    
    const required = ['TIDB_HOST', 'TIDB_USER', 'TIDB_PASSWORD', 'TIDB_DATABASE'];
    const missing = required.filter(v => !process.env[v]);
    
    if (missing.length > 0) {
        console.error('❌ ERROR: Faltan variables:', missing.join(', '));
        process.exit(1);
    }
    
    dbConfig = {
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
        connectTimeout: 30000
    };
    
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   Database: ${dbConfig.database}`);
    
} else {
    console.log('✅ Usando configuración de DESARROLLO LOCAL (XAMPP)');
    
    dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'cine_db',
        port: parseInt(process.env.DB_PORT) || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };
    
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   Database: ${dbConfig.database}`);
}

const pool = mysql.createPool(dbConfig);

const testConnection = async () => {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log('✅ Conexión a base de datos establecida');
        
        // *** CORREGIDO: Usar comillas invertidas para palabra reservada ***
        const [rows] = await connection.query('SELECT VERSION() as version, DATABASE() as `database`, NOW() as fecha');
        
        console.log(`📊 Versión: ${rows[0].version}`);
        console.log(`📊 Base de datos: ${rows[0].database}`);
        console.log(`📊 Fecha: ${rows[0].fecha}`);
        
        // Verificar tablas
        try {
            const [count] = await connection.query('SELECT COUNT(*) as total FROM media WHERE estado = 1');
            console.log(`📊 Total registros en media: ${count[0].total}`);
        } catch (err) {
            console.warn('⚠️ Tabla media no encontrada. Ejecuta el script init.sql');
        }
        
        connection.release();
    } catch (error) {
        console.error('❌ ERROR DE CONEXIÓN:', error.message);
        if (process.env.NODE_ENV === 'production') {
            console.error('⚠️ La aplicación no puede iniciar sin conexión a la base de datos');
            process.exit(1);
        }
    }
};

testConnection();

module.exports = pool;