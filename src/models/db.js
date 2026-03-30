const pool = require('../config/database');

class Database {
    // Ejecutor de consultas profesional
    static async executeQuery(sql, params = []) {
        try {
            const [rows] = await pool.query(sql, params);
            return rows;
        } catch (error) {
            console.error('❌ Error SQL:', error.message);
            throw new Error(`DB Error: ${error.message}`);
        }
    }

    // Obtener todos los medios (Versión simplificada para evitar errores de columnas)
    static async getAllMedia() {
        const sql = `
            SELECT id, serial, titulo, sinopsis, url_pelicula, anio_estreno 
            FROM media 
            ORDER BY id DESC
        `;
        return await this.executeQuery(sql);
    }

    // Obtener catálogos básicos
    static async getAllGeneros() {
        return await this.executeQuery('SELECT * FROM genero');
    }

    static async getAllDirectores() {
        return await this.executeQuery('SELECT * FROM director');
    }

    static async getAllProductoras() {
        return await this.executeQuery('SELECT * FROM productora');
    }

    static async getAllTipos() {
        return await this.executeQuery('SELECT * FROM tipo');
    }

    // Operaciones de inserción
    static async createMedia(media) {
        const sql = `
            INSERT INTO media (serial, titulo, sinopsis, url_pelicula, anio_estreno) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(sql, [
            media.serial, media.titulo, media.sinopsis, media.url_pelicula, media.anio_estreno
        ]);
        return result.insertId;
    }
}

module.exports = Database;