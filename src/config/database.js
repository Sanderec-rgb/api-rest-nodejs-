const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('🚀 Iniciando conexión a base de datos...');

// Detectar entorno y configurar conexión
let dbConfig;

// Si estamos en producción (Render), usar TiDB Cloud
if (process.env.NODE_ENV === 'production' || process.env.TIDB_HOST) {
    console.log('📡 Entorno: PRODUCCIÓN (TiDB Cloud)');
    
    // Verificar variables de TiDB
    const requiredEnv = ['TIDB_HOST', 'TIDB_USER', 'TIDB_PASSWORD', 'TIDB_DATABASE'];
    const missingEnv = requiredEnv.filter(env => !process.env[env]);
    
    if (missingEnv.length > 0) {
        console.error('❌ ERROR: Variables de TiDB faltantes:', missingEnv.join(', '));
        console.error('Por favor, configura estas variables en Render:');
        requiredEnv.forEach(env => console.log(`   - ${env}`));
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
    
    console.log('✅ Configuración TiDB Cloud:');
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   User: ${dbConfig.user}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   SSL: Activado`);
    
} else {
    // Entorno local (XAMPP)
    console.log('📡 Entorno: LOCAL (XAMPP)');
    
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
    
    console.log('✅ Configuración Local:');
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   Database: ${dbConfig.database}`);
}

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Probar conexión
const testConnection = async () => {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log('✅ Conexión a base de datos establecida');
        
        // CORREGIDO: Usar comillas invertidas para palabra reservada
        const [rows] = await connection.query('SELECT VERSION() as version, DATABASE() as `database`, NOW() as fecha');
        console.log(`📊 Versión: ${rows[0].version}`);
        console.log(`📊 Base de datos: ${rows[0].database}`);
        console.log(`📊 Fecha: ${rows[0].fecha}`);
        
        // Verificar si existe la tabla media
        try {
            const [count] = await connection.query('SELECT COUNT(*) as total FROM media WHERE estado = 1');
            console.log(`📊 Total registros en media: ${count[0].total}`);
        } catch (err) {
            console.warn('⚠️ Tabla media no encontrada o vacía');
            console.warn('   Asegúrate de ejecutar el script init.sql en tu base de datos');
        }
        
        connection.release();
    } catch (error) {
        console.error('❌ ERROR DE CONEXIÓN:', error.message);
        console.error('Detalles:', error);
        
        if (process.env.NODE_ENV === 'production') {
            console.error('⚠️ La aplicación no puede iniciar sin conexión a la base de datos');
            process.exit(1);
        } else {
            console.warn('⚠️ Continuando en modo desarrollo sin conexión a BD...');
        }
    }
};

// Ejecutar prueba de conexión
testConnection().catch(err => {
    console.error('❌ Error en prueba de conexión:', err.message);
});

module.exports = pool;