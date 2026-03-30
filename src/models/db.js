const pool = require('../config/database');

class Database {
    // Ejecutor de consultas con manejo de errores
    static async executeQuery(sql, params = []) {
        try {
            // pool.query ya retorna una promesa con [rows, fields]
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
        const results = await this.executeQuery(sql, [id]);
        return results[0] || null;
    }

    static async createMedia(media) {
        const sql = `
            INSERT INTO media (
                serial, titulo, sinopsis, url_pelicula, anio_estreno,
                id_genero, id_director, id_productora, id_tipo, estado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
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
            WHERE id = ? AND estado = 1
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
        const sql = 'UPDATE media SET estado = 0 WHERE id = ?';
        const [result] = await pool.query(sql, [id]);
        return result.affectedRows;
    }

    // ============== MÉTODOS PARA GÉNEROS ==============
    
    static async getAllGeneros() {
        const sql = 'SELECT id, nombre, estado, fecha_creacion FROM genero WHERE estado = 1 ORDER BY nombre';
        return await this.executeQuery(sql);
    }

    static async getGeneroById(id) {
        const sql = 'SELECT id, nombre, estado, fecha_creacion FROM genero WHERE id = ? AND estado = 1';
        const results = await this.executeQuery(sql, [id]);
        return results[0] || null;
    }

    static async createGenero(genero) {
        const sql = 'INSERT INTO genero (nombre, estado) VALUES (?, 1)';
        const [result] = await pool.query(sql, [genero.nombre]);
        return result.insertId;
    }

    static async updateGenero(id, genero) {
        const sql = 'UPDATE genero SET nombre = ? WHERE id = ? AND estado = 1';
        const [result] = await pool.query(sql, [genero.nombre, id]);
        return result.affectedRows;
    }

    static async deleteGenero(id) {
        const sql = 'UPDATE genero SET estado = 0 WHERE id = ?';
        const [result] = await pool.query(sql, [id]);
        return result.affectedRows;
    }

    // ============== MÉTODOS PARA DIRECTORES ==============
    
    static async getAllDirectores() {
        const sql = `
            SELECT id, nombres, apellidos, nacionalidad, estado, fecha_creacion 
            FROM director 
            WHERE estado = 1 
            ORDER BY nombres, apellidos
        `;
        return await this.executeQuery(sql);
    }

    static async getDirectorById(id) {
        const sql = `
            SELECT id, nombres, apellidos, nacionalidad, estado, fecha_creacion 
            FROM director 
            WHERE id = ? AND estado = 1
        `;
        const results = await this.executeQuery(sql, [id]);
        return results[0] || null;
    }

    static async createDirector(director) {
        const sql = 'INSERT INTO director (nombres, apellidos, nacionalidad, estado) VALUES (?, ?, ?, 1)';
        const [result] = await pool.query(sql, [director.nombres, director.apellidos, director.nacionalidad || null]);
        return result.insertId;
    }

    static async updateDirector(id, director) {
        const sql = `
            UPDATE director 
            SET nombres = ?, apellidos = ?, nacionalidad = ? 
            WHERE id = ? AND estado = 1
        `;
        const [result] = await pool.query(sql, [director.nombres, director.apellidos, director.nacionalidad || null, id]);
        return result.affectedRows;
    }

    static async deleteDirector(id) {
        const sql = 'UPDATE director SET estado = 0 WHERE id = ?';
        const [result] = await pool.query(sql, [id]);
        return result.affectedRows;
    }

    // ============== MÉTODOS PARA PRODUCTORAS ==============
    
    static async getAllProductoras() {
        const sql = `
            SELECT id, nombre, sede_social, estado, fecha_creacion 
            FROM productora 
            WHERE estado = 1 
            ORDER BY nombre
        `;
        return await this.executeQuery(sql);
    }

    static async getProductoraById(id) {
        const sql = `
            SELECT id, nombre, sede_social, estado, fecha_creacion 
            FROM productora 
            WHERE id = ? AND estado = 1
        `;
        const results = await this.executeQuery(sql, [id]);
        return results[0] || null;
    }

    static async createProductora(productora) {
        const sql = 'INSERT INTO productora (nombre, sede_social, estado) VALUES (?, ?, 1)';
        const [result] = await pool.query(sql, [productora.nombre, productora.sede_social || null]);
        return result.insertId;
    }

    static async updateProductora(id, productora) {
        const sql = 'UPDATE productora SET nombre = ?, sede_social = ? WHERE id = ? AND estado = 1';
        const [result] = await pool.query(sql, [productora.nombre, productora.sede_social || null, id]);
        return result.affectedRows;
    }

    static async deleteProductora(id) {
        const sql = 'UPDATE productora SET estado = 0 WHERE id = ?';
        const [result] = await pool.query(sql, [id]);
        return result.affectedRows;
    }

    // ============== MÉTODOS PARA TIPOS ==============
    
    static async getAllTipos() {
        const sql = 'SELECT id, nombre, estado, fecha_creacion FROM tipo WHERE estado = 1 ORDER BY nombre';
        return await this.executeQuery(sql);
    }

    static async getTipoById(id) {
        const sql = 'SELECT id, nombre, estado, fecha_creacion FROM tipo WHERE id = ? AND estado = 1';
        const results = await this.executeQuery(sql, [id]);
        return results[0] || null;
    }

    static async createTipo(tipo) {
        const sql = 'INSERT INTO tipo (nombre, estado) VALUES (?, 1)';
        const [result] = await pool.query(sql, [tipo.nombre]);
        return result.insertId;
    }

    static async updateTipo(id, tipo) {
        const sql = 'UPDATE tipo SET nombre = ? WHERE id = ? AND estado = 1';
        const [result] = await pool.query(sql, [tipo.nombre, id]);
        return result.affectedRows;
    }

    static async deleteTipo(id) {
        const sql = 'UPDATE tipo SET estado = 0 WHERE id = ?';
        const [result] = await pool.query(sql, [id]);
        return result.affectedRows;
    }
}

module.exports = Database;