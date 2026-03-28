// ============================================
// FUNCIÓN PRINCIPAL: Probar conexión e inicializar
// ============================================
(async () => {
    try {
        // Probar conexión básica
        const connection = await promisePool.getConnection();
        console.log('✅ Conexión a MySQL establecida correctamente');
        console.log(`📊 Base de datos: ${dbConfig.database}`);
        connection.release();
        
        // Inicializar base de datos (crear tablas si no existen)
        await inicializarBaseDatos();
        
    } catch (error) {
        console.error('❌ Error al conectar a MySQL:', error.message);
        
        // Si es error de base de datos no existente, intentar crearla
        if (error.code === 'ER_BAD_DB_ERROR') {
            console.log(`⚠️  La base de datos "${dbConfig.database}" no existe`);
            console.log('🔧 Intentando crearla...');
            
            try {
                const tempConnection = mysql.createConnection({
                    host: dbConfig.host,
                    user: dbConfig.user,
                    password: dbConfig.password,
                    port: dbConfig.port
                }).promise();
                
                await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
                console.log(`✅ Base de datos "${dbConfig.database}" creada`);
                await tempConnection.end();
                
                // Reintentar inicialización
                await inicializarBaseDatos();
                
            } catch (createError) {
                console.error('❌ No se pudo crear la base de datos:', createError.message);
            }
        } else if (error.code === 'ECONNREFUSED') {
            console.log('⚠️  Asegúrate de que XAMPP con MySQL esté corriendo (localhost)');
            console.log('💡 En Railway esto no es un problema porque la BD está en la nube');
        }
    }
})();

// Exportar el pool de conexiones y la función de inicialización
module.exports = { 
    promisePool, 
    inicializarBaseDatos 
};