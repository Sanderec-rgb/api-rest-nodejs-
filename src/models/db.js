const pool = require('../config/database');

class Database {
    static async getAllMedia() {
        const [rows] = await pool.query(`
            SELECT id, serial, titulo, sinopsis, anio_estreno 
            FROM media 
            ORDER BY id DESC
        `);
        return rows;
    }
}

module.exports = Database;