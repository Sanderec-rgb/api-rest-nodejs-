const pool = require('../config/database');

class Database {
    static async query(sql, params = []) {
        try {
            const [rows] = await pool.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('❌ Error SQL:', error.message);
            throw error;
        }
    }

    // ============== MEDIA ==============
    
    static async getAllMedia() {
        const sql = `
            SELECT 
                m.id,
                m.serial,
                m.titulo,
                m.sinopsis,
                m.url_pelicula,
                m.anio_estreno,
                m.estado,
                m.fecha_creacion,
                g.id AS genero_id,
                g.nombre AS genero_nombre,
                CONCAT(d.nombres, ' ', d.apellidos) AS director_nombre,
                d.id AS director_id,
                p.id AS productora_id,
                p.nombre AS productora_nombre,
                t.id AS tipo_id,
                t.nombre AS tipo_nombre
            FROM media m
            LEFT JOIN genero g ON m.id_genero = g.id
            LEFT JOIN director d ON m.id_director = d.id
            LEFT JOIN productora p ON m.id_productora = p.id
            LEFT JOIN tipo t ON m.id_tipo = t.id
            WHERE m.estado = 1
            ORDER BY m.id DESC
        `;
        return await this.query(sql);
    }

    static async getMediaById(id) {
        const sql = `
            SELECT 
                m.id,
                m.serial,
                m.titulo,
                m.sinopsis,
                m.url_pelicula,
                m.anio_estreno,
                m.estado,
                m.fecha_creacion,
                g.id AS genero_id,
                g.nombre AS genero_nombre,
                CONCAT(d.nombres, ' ', d.apellidos) AS director_nombre,
                d.id AS director_id,
                p.id AS productora_id,
                p.nombre AS productora_nombre,
                t.id AS tipo_id,
                t.nombre AS tipo_nombre
            FROM media m
            LEFT JOIN genero g ON m.id_genero = g.id
            LEFT JOIN director d ON m.id_director = d.id
            LEFT JOIN productora p ON m.id_productora = p.id
            LEFT JOIN tipo t ON m.id_tipo = t.id
            WHERE m.id = ? AND m.estado = 1
        `;
        const rows = await this.query(sql, [id]);
        return rows[0] || null;
    }

    static async createMedia(data) {
        const sql = `
            INSERT INTO media (
                serial, titulo, sinopsis, url_pelicula, anio_estreno,
                id_genero, id_director, id_productora, id_tipo, estado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `;
        const [result] = await pool.execute(sql, [
            data.serial,
            data.titulo,
            data.sinopsis || null,
            data.url_pelicula || null,
            data.anio_estreno || null,
            data.id_genero || null,
            data.id_director || null,
            data.id_productora || null,
            data.id_tipo || null
        ]);
        return result.insertId;
    }

    static async updateMedia(id, data) {
        const sql = `
            UPDATE media 
            SET 
                serial = ?,
                titulo = ?,
                sinopsis = ?,
                url_pelicula = ?,
                anio_estreno = ?,
                id_genero = ?,
                id_director = ?,
                id_productora = ?,
                id_tipo = ?
            WHERE id = ? AND estado = 1
        `;
        const [result] = await pool.execute(sql, [
            data.serial,
            data.titulo,
            data.sinopsis || null,
            data.url_pelicula || null,
            data.anio_estreno || null,
            data.id_genero || null,
            data.id_director || null,
            data.id_productora || null,
            data.id_tipo || null,
            id
        ]);
        return result.affectedRows;
    }

    static async deleteMedia(id) {
        const sql = 'UPDATE media SET estado = 0 WHERE id = ?';
        const [result] = await pool.execute(sql, [id]);
        return result.affectedRows;
    }

    // ============== GÉNEROS ==============
    
    static async getAllGeneros() {
        const sql = 'SELECT id, nombre FROM genero ORDER BY nombre';
        return await this.query(sql);
    }

    static async getGeneroById(id) {
        const sql = 'SELECT id, nombre FROM genero WHERE id = ?';
        const rows = await this.query(sql, [id]);
        return rows[0] || null;
    }

    static async createGenero(data) {
        const sql = 'INSERT INTO genero (nombre) VALUES (?)';
        const [result] = await pool.execute(sql, [data.nombre]);
        return result.insertId;
    }

    static async updateGenero(id, data) {
        const sql = 'UPDATE genero SET nombre = ? WHERE id = ?';
        const [result] = await pool.execute(sql, [data.nombre, id]);
        return result.affectedRows;
    }

    static async deleteGenero(id) {
        const sql = 'DELETE FROM genero WHERE id = ?';
        const [result] = await pool.execute(sql, [id]);
        return result.affectedRows;
    }

    // ============== DIRECTORES ==============
    
    static async getAllDirectores() {
        const sql = `
            SELECT id, nombres, apellidos, nacionalidad 
            FROM director 
            ORDER BY nombres, apellidos
        `;
        return await this.query(sql);
    }

    static async getDirectorById(id) {
        const sql = 'SELECT id, nombres, apellidos, nacionalidad FROM director WHERE id = ?';
        const rows = await this.query(sql, [id]);
        return rows[0] || null;
    }

    static async createDirector(data) {
        const sql = 'INSERT INTO director (nombres, apellidos, nacionalidad) VALUES (?, ?, ?)';
        const [result] = await pool.execute(sql, [data.nombres, data.apellidos, data.nacionalidad || null]);
        return result.insertId;
    }

    static async updateDirector(id, data) {
        const sql = 'UPDATE director SET nombres = ?, apellidos = ?, nacionalidad = ? WHERE id = ?';
        const [result] = await pool.execute(sql, [data.nombres, data.apellidos, data.nacionalidad || null, id]);
        return result.affectedRows;
    }

    static async deleteDirector(id) {
        const sql = 'DELETE FROM director WHERE id = ?';
        const [result] = await pool.execute(sql, [id]);
        return result.affectedRows;
    }

    // ============== PRODUCTORAS ==============
    
    static async getAllProductoras() {
        const sql = 'SELECT id, nombre, sede_social FROM productora ORDER BY nombre';
        return await this.query(sql);
    }

    static async getProductoraById(id) {
        const sql = 'SELECT id, nombre, sede_social FROM productora WHERE id = ?';
        const rows = await this.query(sql, [id]);
        return rows[0] || null;
    }

    static async createProductora(data) {
        const sql = 'INSERT INTO productora (nombre, sede_social) VALUES (?, ?)';
        const [result] = await pool.execute(sql, [data.nombre, data.sede_social || null]);
        return result.insertId;
    }

    static async updateProductora(id, data) {
        const sql = 'UPDATE productora SET nombre = ?, sede_social = ? WHERE id = ?';
        const [result] = await pool.execute(sql, [data.nombre, data.sede_social || null, id]);
        return result.affectedRows;
    }

    static async deleteProductora(id) {
        const sql = 'DELETE FROM productora WHERE id = ?';
        const [result] = await pool.execute(sql, [id]);
        return result.affectedRows;
    }

    // ============== TIPOS ==============
    
    static async getAllTipos() {
        const sql = 'SELECT id, nombre FROM tipo ORDER BY nombre';
        return await this.query(sql);
    }

    static async getTipoById(id) {
        const sql = 'SELECT id, nombre FROM tipo WHERE id = ?';
        const rows = await this.query(sql, [id]);
        return rows[0] || null;
    }

    static async createTipo(data) {
        const sql = 'INSERT INTO tipo (nombre) VALUES (?)';
        const [result] = await pool.execute(sql, [data.nombre]);
        return result.insertId;
    }

    static async updateTipo(id, data) {
        const sql = 'UPDATE tipo SET nombre = ? WHERE id = ?';
        const [result] = await pool.execute(sql, [data.nombre, id]);
        return result.affectedRows;
    }

    static async deleteTipo(id) {
        const sql = 'DELETE FROM tipo WHERE id = ?';
        const [result] = await pool.execute(sql, [id]);
        return result.affectedRows;
    }
}

module.exports = Database;