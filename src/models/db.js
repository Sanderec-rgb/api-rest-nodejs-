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
                m.fecha_actualizacion,
                g.id AS genero_id,
                g.nombre AS genero_nombre,
                CONCAT(d.nombres, ' ', d.apellidos) AS director_nombre,
                d.id AS director_id,
                p.id AS productora_id,
                p.nombre AS productora_nombre,
                t.id AS tipo_id,
                t.nombre AS tipo_nombre
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
            SELECT 
                m.id,
                m.serial,
                m.titulo,
                m.sinopsis,
                m.url_pelicula,
                m.anio_estreno,
                m.estado,
                m.fecha_creacion,
                m.fecha_actualizacion,
                g.id AS genero_id,
                g.nombre AS genero_nombre,
                CONCAT(d.nombres, ' ', d.apellidos) AS director_nombre,
                d.id AS director_id,
                p.id AS productora_id,
                p.nombre AS productora_nombre,
                t.id AS tipo_id,
                t.nombre AS tipo_nombre
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
        const sql = 'SELECT id, nombre, estado, fecha_creacion FROM genero WHERE estado = 1 ORDER BY nombre';
        return await this.query(sql);
    }

    static async getGeneroById(id) {
        const sql = 'SELECT id, nombre, estado, fecha_creacion FROM genero WHERE id = ? AND estado = 1';
        const rows = await this.query(sql, [id]);
        return rows[0] || null;
    }

    static async createGenero(data) {
        const sql = 'INSERT INTO genero (nombre, estado) VALUES (?, 1)';
        const [result] = await pool.execute(sql, [data.nombre]);
        return result.insertId;
    }

    static async updateGenero(id, data) {
        const sql = 'UPDATE genero SET nombre = ? WHERE id = ? AND estado = 1';
        const [result] = await pool.execute(sql, [data.nombre, id]);
        return result.affectedRows;
    }

    static async deleteGenero(id) {
        const sql = 'UPDATE genero SET estado = 0 WHERE id = ?';
        const [result] = await pool.execute(sql, [id]);
        return result.affectedRows;
    }

    // ============== DIRECTORES ==============
    
    static async getAllDirectores() {
        const sql = `
            SELECT id, nombres, apellidos, nacionalidad, estado, fecha_creacion 
            FROM director 
            WHERE estado = 1 
            ORDER BY nombres, apellidos
        `;
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

    static async updateDirector(id, data) {
        const sql = 'UPDATE director SET nombres = ?, apellidos = ?, nacionalidad = ? WHERE id = ? AND estado = 1';
        const [result] = await pool.execute(sql, [data.nombres, data.apellidos, data.nacionalidad || null, id]);
        return result.affectedRows;
    }

    static async deleteDirector(id) {
        const sql = 'UPDATE director SET estado = 0 WHERE id = ?';
        const [result] = await pool.execute(sql, [id]);
        return result.affectedRows;
    }

    // ============== PRODUCTORAS ==============
    
    static async getAllProductoras() {
        const sql = 'SELECT id, nombre, sede_social, estado, fecha_creacion FROM productora WHERE estado = 1 ORDER BY nombre';
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

    static async updateProductora(id, data) {
        const sql = 'UPDATE productora SET nombre = ?, sede_social = ? WHERE id = ? AND estado = 1';
        const [result] = await pool.execute(sql, [data.nombre, data.sede_social || null, id]);
        return result.affectedRows;
    }

    static async deleteProductora(id) {
        const sql = 'UPDATE productora SET estado = 0 WHERE id = ?';
        const [result] = await pool.execute(sql, [id]);
        return result.affectedRows;
    }

    // ============== TIPOS ==============
    
    static async getAllTipos() {
        const sql = 'SELECT id, nombre, estado, fecha_creacion FROM tipo WHERE estado = 1 ORDER BY nombre';
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

    static async updateTipo(id, data) {
        const sql = 'UPDATE tipo SET nombre = ? WHERE id = ? AND estado = 1';
        const [result] = await pool.execute(sql, [data.nombre, id]);
        return result.affectedRows;
    }

    static async deleteTipo(id) {
        const sql = 'UPDATE tipo SET estado = 0 WHERE id = ?';
        const [result] = await pool.execute(sql, [id]);
        return result.affectedRows;
    }
}

module.exports = Database;