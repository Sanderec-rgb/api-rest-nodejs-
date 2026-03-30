const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.TIDB_HOST,
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASSWORD,
  database: process.env.TIDB_DATABASE,
  port: process.env.TIDB_PORT || 4000,
  // --- ESTA ES LA LÍNEA CLAVE ---
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true // TiDB Cloud requiere esto por seguridad
  }
});

module.exports = pool.promise();