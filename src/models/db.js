const pool = require('../config/database');

class Database {
    // Método genérico para ejecutar queries
    static async query(sql, params = []) {
        try {
            const [rows] = await pool.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('❌ Error en query:', error.message);
            console.error('SQL:', sql);
            throw error;
        }
    }

    // Media
    static async getAllMedia() {
        const sql = `
            SELECT m.*, 
                   g.nombre as genero_nombre,
                   CONCAT(d.nombres, ' ', d.apellidos) as director_nombre,
                   p.nombre as productora_nombre,
                   t.nombre as tipo_nombre
            FROM media m
            LEFT JOIN genero g ON m.id_genero = g.id AND g.estado = 1
            LEFT JOIN director d ON m.id_director = d.id AND d.estado = 1
            LEFT JOIN productora p ON m.id_productora = p.id AND p.estado = 1
            LEFT JOIN tipo t ON m.id_tipo = t.id AND t.estado = 1
            WHERE m.estado = 1
            ORDER BY m.id DESC
        `;
        return await this.query(sql);
    }

    static async getMediaById(id) {
        const sql = `
            SELECT m.*, 
                   g.nombre as genero_nombre,
                   CONCAT(d.nombres, ' ', d.apellidos) as director_nombre,
                   p.nombre as productora_nombre,
                   t.nombre as tipo_nombre
            FROM media m
            LEFT JOIN genero g ON m.id_genero = g.id AND g.estado = 1
            LEFT JOIN director d ON m.id_director = d.id AND d.estado = 1
            LEFT JOIN productora p ON m.id_productora = p.id AND p.estado = 1
            LEFT JOIN tipo t ON m.id_tipo = t.id AND t.estado = 1
            WHERE m.id = ? AND m.estado = 1
        `;
        const rows = await this.query(sql, [id]);
        return rows[0] || null;
    }

    // Géneros
    static async getAllGeneros() {
        const sql = 'SELECT * FROM genero WHERE estado = 1 ORDER BY nombre';
        return await this.query(sql);
    }

    static async getGeneroById(id) {
        const sql = 'SELECT * FROM genero WHERE id = ? AND estado = 1';
        const rows = await this.query(sql, [id]);
        return rows[0] || null;
    }

    static async createGenero(data) {
        const sql = 'INSERT INTO genero (nombre, estado) VALUES (?, 1)';
        const [result] = await pool.execute(sql, [data.nombre]);
        return result.insertId;
    }

    // Directores
    static async getAllDirectores() {
        const sql = 'SELECT * FROM director WHERE estado = 1 ORDER BY nombres, apellidos';
        return await this.query(sql);
    }

    static async getDirectorById(id) {
        const sql = 'SELECT * FROM director WHERE id = ? AND estado = 1';
        const rows = await this.query(sql, [id]);
        return rows[0] || null;
    }

    static async createDirector(data) {
        const sql = 'INSERT INTO director (nombres, apellidos, nacionalidad, estado) VALUES (?, ?, ?, 1)';
        const [result] = await pool.execute(sql, [data.nombres, data.apellidos, data.nacionalidad || null]);
        return result.insertId;
    }

    // Productoras
    static async getAllProductoras() {
        const sql = 'SELECT * FROM productora WHERE estado = 1 ORDER BY nombre';
        return await this.query(sql);
    }

    static async getProductoraById(id) {
        const sql = 'SELECT * FROM productora WHERE id = ? AND estado = 1';
        const rows = await this.query(sql, [id]);
        return rows[0] || null;
    }

    static async createProductora(data) {
        const sql = 'INSERT INTO productora (nombre, sede_social, estado) VALUES (?, ?, 1)';
        const [result] = await pool.execute(sql, [data.nombre, data.sede_social || null]);
        return result.insertId;
    }

    // Tipos
    static async getAllTipos() {
        const sql = 'SELECT * FROM tipo WHERE estado = 1 ORDER BY nombre';
        return await this.query(sql);
    }

    static async getTipoById(id) {
        const sql = 'SELECT * FROM tipo WHERE id = ? AND estado = 1';
        const rows = await this.query(sql, [id]);
        return rows[0] || null;
    }

    static async createTipo(data) {
        const sql = 'INSERT INTO tipo (nombre, estado) VALUES (?, 1)';
        const [result] = await pool.execute(sql, [data.nombre]);
        return result.insertId;
    }
}

module.exports = Database;