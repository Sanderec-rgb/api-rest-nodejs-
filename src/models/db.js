const pool = require('../config/database');

class Database {
    // Ejecutor de consultas con manejo de errores mejorado
    static async executeQuery(sql, params = []) {
        try {
            const [rows] = await pool.query(sql, params);
            return rows;
        } catch (error) {
            console.error('❌ Error en consulta SQL:', error.message);
            console.error('SQL:', sql);
            console.error('Params:', params);
            throw error;
        }
    }

    // ============== MÉTODOS PARA MEDIA ==============
    
    static async getAllMedia() {
        const sql = `
            SELECT 
                m.id,
                m.serial,
                m.titulo,
                m.sinopsis,
                m.url_pelicula,
                m.anio_estreno,
                m.created_at,
                m.updated_at,
                g.id AS genero_id,
                g.nombre AS genero_nombre,
                d.id AS director_id,
                d.nombre AS director_nombre,
                p.id AS productora_id,
                p.nombre AS productora_nombre,
                t.id AS tipo_id,
                t.nombre AS tipo_nombre
            FROM media m
            LEFT JOIN genero g ON m.id_genero = g.id
            LEFT JOIN director d ON m.id_director = d.id
            LEFT JOIN productora p ON m.id_productora = p.id
            LEFT JOIN tipo t ON m.id_tipo = t.id
            ORDER BY m.id DESC
        `;
        return await this.executeQuery(sql);
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
                m.created_at,
                m.updated_at,
                g.id AS genero_id,
                g.nombre AS genero_nombre,
                d.id AS director_id,
                d.nombre AS director_nombre,
                p.id AS productora_id,
                p.nombre AS productora_nombre,
                t.id AS tipo_id,
                t.nombre AS tipo_nombre
            FROM media m
            LEFT JOIN genero g ON m.id_genero = g.id
            LEFT JOIN director d ON m.id_director = d.id
            LEFT JOIN productora p ON m.id_productora = p.id
            LEFT JOIN tipo t ON m.id_tipo = t.id
            WHERE m.id = ?
        `;
        const results = await this.executeQuery(sql, [id]);
        return results[0] || null;
    }

    static async createMedia(media) {
        const sql = `
            INSERT INTO media (
                serial, titulo, sinopsis, url_pelicula, anio_estreno,
                id_genero, id_director, id_productora, id_tipo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(sql, [
            media.serial,
            media.titulo,
            media.sinopsis || null,
            media.url_pelicula || null,
            media.anio_estreno || null,
            media.id_genero || null,
            media.id_director || null,
            media.id_productora || null,
            media.id_tipo || null
        ]);
        return result.insertId;
    }

    static async updateMedia(id, media) {
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
            WHERE id = ?
        `;
        const [result] = await pool.query(sql, [
            media.serial,
            media.titulo,
            media.sinopsis || null,
            media.url_pelicula || null,
            media.anio_estreno || null,
            media.id_genero || null,
            media.id_director || null,
            media.id_productora || null,
            media.id_tipo || null,
            id
        ]);
        return result.affectedRows;
    }

    static async deleteMedia(id) {
        const sql = 'DELETE FROM media WHERE id = ?';
        const [result] = await pool.query(sql, [id]);
        return result.affectedRows;
    }

    // ============== MÉTODOS PARA GÉNEROS ==============
    
    static async getAllGeneros() {
        const sql = 'SELECT id, nombre, descripcion FROM genero ORDER BY nombre';
        return await this.executeQuery(sql);
    }

    static async getGeneroById(id) {
        const sql = 'SELECT id, nombre, descripcion FROM genero WHERE id = ?';
        const results = await this.executeQuery(sql, [id]);
        return results[0] || null;
    }

    static async createGenero(genero) {
        const sql = 'INSERT INTO genero (nombre, descripcion) VALUES (?, ?)';
        const [result] = await pool.query(sql, [genero.nombre, genero.descripcion || null]);
        return result.insertId;
    }

    static async updateGenero(id, genero) {
        const sql = 'UPDATE genero SET nombre = ?, descripcion = ? WHERE id = ?';
        const [result] = await pool.query(sql, [genero.nombre, genero.descripcion || null, id]);
        return result.affectedRows;
    }

    static async deleteGenero(id) {
        const sql = 'DELETE FROM genero WHERE id = ?';
        const [result] = await pool.query(sql, [id]);
        return result.affectedRows;
    }

    // ============== MÉTODOS PARA DIRECTORES ==============
    
    static async getAllDirectores() {
        const sql = 'SELECT id, nombre, nacionalidad, fecha_nacimiento FROM director ORDER BY nombre';
        return await this.executeQuery(sql);
    }

    static async getDirectorById(id) {
        const sql = 'SELECT id, nombre, nacionalidad, fecha_nacimiento FROM director WHERE id = ?';
        const results = await this.executeQuery(sql, [id]);
        return results[0] || null;
    }

    static async createDirector(director) {
        const sql = 'INSERT INTO director (nombre, nacionalidad, fecha_nacimiento) VALUES (?, ?, ?)';
        const [result] = await pool.query(sql, [
            director.nombre, 
            director.nacionalidad || null, 
            director.fecha_nacimiento || null
        ]);
        return result.insertId;
    }

    static async updateDirector(id, director) {
        const sql = 'UPDATE director SET nombre = ?, nacionalidad = ?, fecha_nacimiento = ? WHERE id = ?';
        const [result] = await pool.query(sql, [
            director.nombre, 
            director.nacionalidad || null, 
            director.fecha_nacimiento || null, 
            id
        ]);
        return result.affectedRows;
    }

    static async deleteDirector(id) {
        const sql = 'DELETE FROM director WHERE id = ?';
        const [result] = await pool.query(sql, [id]);
        return result.affectedRows;
    }

    // ============== MÉTODOS PARA PRODUCTORAS ==============
    
    static async getAllProductoras() {
        const sql = 'SELECT id, nombre, pais, sitio_web FROM productora ORDER BY nombre';
        return await this.executeQuery(sql);
    }

    static async getProductoraById(id) {
        const sql = 'SELECT id, nombre, pais, sitio_web FROM productora WHERE id = ?';
        const results = await this.executeQuery(sql, [id]);
        return results[0] || null;
    }

    static async createProductora(productora) {
        const sql = 'INSERT INTO productora (nombre, pais, sitio_web) VALUES (?, ?, ?)';
        const [result] = await pool.query(sql, [
            productora.nombre, 
            productora.pais || null, 
            productora.sitio_web || null
        ]);
        return result.insertId;
    }

    static async updateProductora(id, productora) {
        const sql = 'UPDATE productora SET nombre = ?, pais = ?, sitio_web = ? WHERE id = ?';
        const [result] = await pool.query(sql, [
            productora.nombre, 
            productora.pais || null, 
            productora.sitio_web || null, 
            id
        ]);
        return result.affectedRows;
    }

    static async deleteProductora(id) {
        const sql = 'DELETE FROM productora WHERE id = ?';
        const [result] = await pool.query(sql, [id]);
        return result.affectedRows;
    }

    // ============== MÉTODOS PARA TIPOS ==============
    
    static async getAllTipos() {
        const sql = 'SELECT id, nombre, descripcion FROM tipo ORDER BY nombre';
        return await this.executeQuery(sql);
    }

    static async getTipoById(id) {
        const sql = 'SELECT id, nombre, descripcion FROM tipo WHERE id = ?';
        const results = await this.executeQuery(sql, [id]);
        return results[0] || null;
    }

    static async createTipo(tipo) {
        const sql = 'INSERT INTO tipo (nombre, descripcion) VALUES (?, ?)';
        const [result] = await pool.query(sql, [tipo.nombre, tipo.descripcion || null]);
        return result.insertId;
    }

    static async updateTipo(id, tipo) {
        const sql = 'UPDATE tipo SET nombre = ?, descripcion = ? WHERE id = ?';
        const [result] = await pool.query(sql, [tipo.nombre, tipo.descripcion || null, id]);
        return result.affectedRows;
    }

    static async deleteTipo(id) {
        const sql = 'DELETE FROM tipo WHERE id = ?';
        const [result] = await pool.query(sql, [id]);
        return result.affectedRows;
    }
}

module.exports = Database;