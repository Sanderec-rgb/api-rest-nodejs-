/**
 * Configuración de la conexión a MySQL con auto-inicialización
 */

const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuración de la base de datos
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cine_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    multipleStatements: true
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

// Variable para controlar si ya se inicializó
let inicializado = false;

/**
 * Lee y ejecuta el archivo SQL para crear tablas y datos
 */
async function ejecutarScriptSQL(connection) {
    const sqlPath = path.join(__dirname, '../../database/init.sql');
    
    if (!fs.existsSync(sqlPath)) {
        console.log('⚠️  No se encontró el archivo database/init.sql');
        console.log('💡 Las tablas deben crearse manualmente');
        return false;
    }
    
    try {
        const sql = fs.readFileSync(sqlPath, 'utf8');
        console.log('📦 Ejecutando script SQL de inicialización...');
        
        await connection.query(sql);
        
        console.log('✅ Tablas y datos iniciales creados correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error al ejecutar script SQL:', error.message);
        return false;
    }
}

/**
 * Verifica si la base de datos tiene tablas
 */
async function tieneTablas(connection) {
    try {
        const [rows] = await connection.query('SHOW TABLES');
        return rows.length > 0;
    } catch (error) {
        return false;
    }
}

/**
 * Inicializa la base de datos (crea tablas y datos si no existen)
 */
async function inicializarBaseDatos() {
    if (inicializado) {
        return;
    }
    
    // Crear conexión temporal sin base de datos específica
    const tempConnection = await mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        port: dbConfig.port,
        multipleStatements: true
    }).promise();
    
    try {
        console.log('🔧 Verificando base de datos...');
        
        // 1. Crear la base de datos si no existe
        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
        console.log(`✅ Base de datos "${dbConfig.database}" verificada`);
        
        // 2. Usar la base de datos
        await tempConnection.query(`USE ${dbConfig.database}`);
        
        // 3. Verificar si ya hay tablas
        const tablasExisten = await tieneTablas(tempConnection);
        
        if (!tablasExisten) {
            console.log('📦 Base de datos vacía. Creando estructura...');
            await ejecutarScriptSQL(tempConnection);
        } else {
            console.log('✅ La base de datos ya tiene tablas, no se modifica');
        }
        
        inicializado = true;
        
    } catch (error) {
        console.error('❌ Error en inicialización:', error.message);
        throw error;
    } finally {
        await tempConnection.end();
    }
}

// Probar conexión inicial
(async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('✅ Conexión a MySQL establecida correctamente');
        console.log(`📊 Base de datos: ${dbConfig.database}`);
        connection.release();
        
        // Inicializar base de datos
        await inicializarBaseDatos();
        
    } catch (error) {
        console.error('❌ Error al conectar a MySQL:', error.message);
        
        if (error.code === 'ER_BAD_DB_ERROR') {
            console.log(`⚠️  La base de datos "${dbConfig.database}" no existe`);
            console.log('🔧 Intentando crearla...');
            
            try {
                const tempConnection = await mysql.createConnection({
                    host: dbConfig.host,
                    user: dbConfig.user,
                    password: dbConfig.password,
                    port: dbConfig.port
                }).promise();
                
                await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
                console.log(`✅ Base de datos "${dbConfig.database}" creada`);
                await tempConnection.end();
                
                // Reintentar
                const connection2 = await promisePool.getConnection();
                console.log('✅ Conexión establecida');
                connection2.release();
                await inicializarBaseDatos();
                
            } catch (createError) {
                console.error('❌ No se pudo crear la base de datos:', createError.message);
            }
        } else if (error.code === 'ECONNREFUSED') {
            console.log('⚠️  Asegúrate de que XAMPP con MySQL esté corriendo');
        }
    }
})();

// Exportar el pool de conexiones y la función de inicialización
module.exports = { 
    promisePool, 
    inicializarBaseDatos 
};