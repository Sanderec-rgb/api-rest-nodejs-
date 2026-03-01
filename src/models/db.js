/**
 * Modelo de datos - Operaciones con la base de datos
 */

const pool = require('../config/database');

class Database {
    // Método genérico para ejecutar consultas
    static async executeQuery(sql, params = []) {
        try {
            const [rows] = await pool.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('Error en consulta SQL:', error);
            throw new Error(`Error en base de datos: ${error.message}`);
        }
    }

    // ==================== MÓDULO GÉNERO ====================
    static async getAllGeneros() {
        return await this.executeQuery(
            'SELECT id, nombre, estado, fecha_creacion FROM genero WHERE estado = true ORDER BY nombre'
        );
    }

    static async getGeneroById(id) {
        const results = await this.executeQuery(
            'SELECT id, nombre, estado, fecha_creacion FROM genero WHERE id = ? AND estado = true',
            [id]
        );
        return results[0];
    }

    static async createGenero(genero) {
        const result = await this.executeQuery(
            'INSERT INTO genero (nombre) VALUES (?)',
            [genero.nombre]
        );
        return result.insertId;
    }

    static async updateGenero(id, genero) {
        const result = await this.executeQuery(
            'UPDATE genero SET nombre = ? WHERE id = ?',
            [genero.nombre, id]
        );
        return result.affectedRows;
    }

    static async deleteGenero(id) {
        const result = await this.executeQuery(
            'UPDATE genero SET estado = false WHERE id = ?',
            [id]
        );
        return result.affectedRows;
    }

    // ==================== MÓDULO DIRECTOR ====================
    static async getAllDirectores() {
        return await this.executeQuery(
            'SELECT id, nombres, apellidos, nacionalidad, estado, fecha_creacion FROM director WHERE estado = true ORDER BY apellidos, nombres'
        );
    }

    static async getDirectorById(id) {
        const results = await this.executeQuery(
            'SELECT id, nombres, apellidos, nacionalidad, estado, fecha_creacion FROM director WHERE id = ? AND estado = true',
            [id]
        );
        return results[0];
    }

    static async createDirector(director) {
        const result = await this.executeQuery(
            'INSERT INTO director (nombres, apellidos, nacionalidad) VALUES (?, ?, ?)',
            [director.nombres, director.apellidos, director.nacionalidad]
        );
        return result.insertId;
    }

    static async updateDirector(id, director) {
        const result = await this.executeQuery(
            'UPDATE director SET nombres = ?, apellidos = ?, nacionalidad = ? WHERE id = ?',
            [director.nombres, director.apellidos, director.nacionalidad, id]
        );
        return result.affectedRows;
    }

    static async deleteDirector(id) {
        const result = await this.executeQuery(
            'UPDATE director SET estado = false WHERE id = ?',
            [id]
        );
        return result.affectedRows;
    }

    // ==================== MÓDULO PRODUCTORA ====================
    static async getAllProductoras() {
        return await this.executeQuery(
            'SELECT id, nombre, sede_social, estado, fecha_creacion FROM productora WHERE estado = true ORDER BY nombre'
        );
    }

    static async getProductoraById(id) {
        const results = await this.executeQuery(
            'SELECT id, nombre, sede_social, estado, fecha_creacion FROM productora WHERE id = ? AND estado = true',
            [id]
        );
        return results[0];
    }

    static async createProductora(productora) {
        const result = await this.executeQuery(
            'INSERT INTO productora (nombre, sede_social) VALUES (?, ?)',
            [productora.nombre, productora.sede_social]
        );
        return result.insertId;
    }

    static async updateProductora(id, productora) {
        const result = await this.executeQuery(
            'UPDATE productora SET nombre = ?, sede_social = ? WHERE id = ?',
            [productora.nombre, productora.sede_social, id]
        );
        return result.affectedRows;
    }

    static async deleteProductora(id) {
        const result = await this.executeQuery(
            'UPDATE productora SET estado = false WHERE id = ?',
            [id]
        );
        return result.affectedRows;
    }

    // ==================== MÓDULO TIPO ====================
    static async getAllTipos() {
        return await this.executeQuery(
            'SELECT id, nombre, estado, fecha_creacion FROM tipo WHERE estado = true ORDER BY nombre'
        );
    }

    static async getTipoById(id) {
        const results = await this.executeQuery(
            'SELECT id, nombre, estado, fecha_creacion FROM tipo WHERE id = ? AND estado = true',
            [id]
        );
        return results[0];
    }

    static async createTipo(tipo) {
        const result = await this.executeQuery(
            'INSERT INTO tipo (nombre) VALUES (?)',
            [tipo.nombre]
        );
        return result.insertId;
    }

    static async updateTipo(id, tipo) {
        const result = await this.executeQuery(
            'UPDATE tipo SET nombre = ? WHERE id = ?',
            [tipo.nombre, id]
        );
        return result.affectedRows;
    }

    static async deleteTipo(id) {
        const result = await this.executeQuery(
            'UPDATE tipo SET estado = false WHERE id = ?',
            [id]
        );
        return result.affectedRows;
    }

    // ==================== MÓDULO MEDIA ====================
    static async getAllMedia() {
        return await this.executeQuery(`
            SELECT 
                m.id, m.serial, m.titulo, m.sinopsis, m.url_pelicula,
                m.anio_estreno, m.estado, m.fecha_creacion,
                g.id as genero_id, g.nombre as genero_nombre,
                d.id as director_id, d.nombres, d.apellidos,
                p.id as productora_id, p.nombre as productora_nombre,
                t.id as tipo_id, t.nombre as tipo_nombre
            FROM media m
            LEFT JOIN genero g ON m.id_genero = g.id
            LEFT JOIN director d ON m.id_director = d.id
            LEFT JOIN productora p ON m.id_productora = p.id
            LEFT JOIN tipo t ON m.id_tipo = t.id
            WHERE m.estado = true
            ORDER BY m.fecha_creacion DESC
        `);
    }

    static async getMediaById(id) {
        const results = await this.executeQuery(`
            SELECT 
                m.id, m.serial, m.titulo, m.sinopsis, m.url_pelicula,
                m.anio_estreno, m.estado, m.fecha_creacion,
                g.id as genero_id, g.nombre as genero_nombre,
                d.id as director_id, d.nombres, d.apellidos, d.nacionalidad,
                p.id as productora_id, p.nombre as productora_nombre, p.sede_social,
                t.id as tipo_id, t.nombre as tipo_nombre
            FROM media m
            LEFT JOIN genero g ON m.id_genero = g.id
            LEFT JOIN director d ON m.id_director = d.id
            LEFT JOIN productora p ON m.id_productora = p.id
            LEFT JOIN tipo t ON m.id_tipo = t.id
            WHERE m.id = ? AND m.estado = true
        `, [id]);
        return results[0];
    }

    static async createMedia(media) {
        const result = await this.executeQuery(
            `INSERT INTO media 
            (serial, titulo, sinopsis, url_pelicula, anio_estreno, 
             id_genero, id_director, id_productora, id_tipo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                media.serial, 
                media.titulo, 
                media.sinopsis || null, 
                media.url_pelicula || null, 
                media.anio_estreno || null,
                media.id_genero || null, 
                media.id_director || null, 
                media.id_productora || null, 
                media.id_tipo || null
            ]
        );
        return result.insertId;
    }

    static async updateMedia(id, media) {
        const result = await this.executeQuery(
            `UPDATE media 
             SET serial = ?, titulo = ?, sinopsis = ?, url_pelicula = ?, 
                 anio_estreno = ?, id_genero = ?, id_director = ?, 
                 id_productora = ?, id_tipo = ?
             WHERE id = ?`,
            [
                media.serial, 
                media.titulo, 
                media.sinopsis, 
                media.url_pelicula, 
                media.anio_estreno,
                media.id_genero, 
                media.id_director, 
                media.id_productora, 
                media.id_tipo,
                id
            ]
        );
        return result.affectedRows;
    }

    static async deleteMedia(id) {
        const result = await this.executeQuery(
            'UPDATE media SET estado = false WHERE id = ?',
            [id]
        );
        return result.affectedRows;
    }

    // ==================== MÉTODOS AUXILIARES ====================
    static async verificarExistencia(tabla, id) {
        const result = await this.executeQuery(
            `SELECT id FROM ${tabla} WHERE id = ? AND estado = true`,
            [id]
        );
        return result.length > 0;
    }
}

module.exports = Database;