/**
 * Modelo de datos - Operaciones con la base de datos (PostgreSQL)
 */

const pool = require('../config/database');

class Database {
    // Método genérico para ejecutar consultas (adaptado para PostgreSQL)
    static async executeQuery(sql, params = []) {
        try {
            // PostgreSQL usa query, no execute
            const result = await pool.query(sql, params);
            return result.rows;
        } catch (error) {
            console.error('Error en consulta SQL:', error);
            throw new Error(`Error en base de datos: ${error.message}`);
        }
    }

    // Método para INSERT que devuelve el ID insertado
    static async executeInsert(sql, params = []) {
        try {
            const result = await pool.query(sql, params);
            return result.rows[0]?.id || null;
        } catch (error) {
            console.error('Error en consulta SQL:', error);
            throw new Error(`Error en base de datos: ${error.message}`);
        }
    }

    // Método para UPDATE/DELETE que devuelve filas afectadas
    static async executeUpdate(sql, params = []) {
        try {
            const result = await pool.query(sql, params);
            return result.rowCount;
        } catch (error) {
            console.error('Error en consulta SQL:', error);
            throw new Error(`Error en base de datos: ${error.message}`);
        }
    }

    // ==================== MÓDULO GÉNERO ====================
    static async getAllGeneros() {
        return await this.executeQuery(
            'SELECT id, nombre, estado, fecha_creacion FROM genero WHERE estado = 1 ORDER BY nombre'
        );
    }

    static async getGeneroById(id) {
        const results = await this.executeQuery(
            'SELECT id, nombre, estado, fecha_creacion FROM genero WHERE id = $1 AND estado = 1',
            [id]
        );
        return results[0];
    }

    static async createGenero(genero) {
        const sql = 'INSERT INTO genero (nombre) VALUES ($1) RETURNING id';
        return await this.executeInsert(sql, [genero.nombre]);
    }

    static async updateGenero(id, genero) {
        const sql = 'UPDATE genero SET nombre = $1, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = $2';
        return await this.executeUpdate(sql, [genero.nombre, id]);
    }

    static async deleteGenero(id) {
        const sql = 'UPDATE genero SET estado = 0 WHERE id = $1';
        return await this.executeUpdate(sql, [id]);
    }

    // ==================== MÓDULO DIRECTOR ====================
    static async getAllDirectores() {
        return await this.executeQuery(
            'SELECT id, nombres, apellidos, nacionalidad, estado, fecha_creacion FROM director WHERE estado = 1 ORDER BY apellidos, nombres'
        );
    }

    static async getDirectorById(id) {
        const results = await this.executeQuery(
            'SELECT id, nombres, apellidos, nacionalidad, estado, fecha_creacion FROM director WHERE id = $1 AND estado = 1',
            [id]
        );
        return results[0];
    }

    static async createDirector(director) {
        const sql = 'INSERT INTO director (nombres, apellidos, nacionalidad) VALUES ($1, $2, $3) RETURNING id';
        return await this.executeInsert(sql, [director.nombres, director.apellidos, director.nacionalidad]);
    }

    static async updateDirector(id, director) {
        const sql = 'UPDATE director SET nombres = $1, apellidos = $2, nacionalidad = $3, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = $4';
        return await this.executeUpdate(sql, [director.nombres, director.apellidos, director.nacionalidad, id]);
    }

    static async deleteDirector(id) {
        const sql = 'UPDATE director SET estado = 0 WHERE id = $1';
        return await this.executeUpdate(sql, [id]);
    }

    // ==================== MÓDULO PRODUCTORA ====================
    static async getAllProductoras() {
        return await this.executeQuery(
            'SELECT id, nombre, sede_social, estado, fecha_creacion FROM productora WHERE estado = 1 ORDER BY nombre'
        );
    }

    static async getProductoraById(id) {
        const results = await this.executeQuery(
            'SELECT id, nombre, sede_social, estado, fecha_creacion FROM productora WHERE id = $1 AND estado = 1',
            [id]
        );
        return results[0];
    }

    static async createProductora(productora) {
        const sql = 'INSERT INTO productora (nombre, sede_social) VALUES ($1, $2) RETURNING id';
        return await this.executeInsert(sql, [productora.nombre, productora.sede_social]);
    }

    static async updateProductora(id, productora) {
        const sql = 'UPDATE productora SET nombre = $1, sede_social = $2, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = $3';
        return await this.executeUpdate(sql, [productora.nombre, productora.sede_social, id]);
    }

    static async deleteProductora(id) {
        const sql = 'UPDATE productora SET estado = 0 WHERE id = $1';
        return await this.executeUpdate(sql, [id]);
    }

    // ==================== MÓDULO TIPO ====================
    static async getAllTipos() {
        return await this.executeQuery(
            'SELECT id, nombre, estado, fecha_creacion FROM tipo WHERE estado = 1 ORDER BY nombre'
        );
    }

    static async getTipoById(id) {
        const results = await this.executeQuery(
            'SELECT id, nombre, estado, fecha_creacion FROM tipo WHERE id = $1 AND estado = 1',
            [id]
        );
        return results[0];
    }

    static async createTipo(tipo) {
        const sql = 'INSERT INTO tipo (nombre) VALUES ($1) RETURNING id';
        return await this.executeInsert(sql, [tipo.nombre]);
    }

    static async updateTipo(id, tipo) {
        const sql = 'UPDATE tipo SET nombre = $1, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = $2';
        return await this.executeUpdate(sql, [tipo.nombre, id]);
    }

    static async deleteTipo(id) {
        const sql = 'UPDATE tipo SET estado = 0 WHERE id = $1';
        return await this.executeUpdate(sql, [id]);
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
            WHERE m.estado = 1
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
            WHERE m.id = $1 AND m.estado = 1
        `, [id]);
        return results[0];
    }

    static async createMedia(media) {
        const sql = `
            INSERT INTO media 
            (serial, titulo, sinopsis, url_pelicula, anio_estreno, 
             id_genero, id_director, id_productora, id_tipo) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        `;
        return await this.executeInsert(sql, [
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
    }

    static async updateMedia(id, media) {
        const sql = `
            UPDATE media 
             SET serial = $1, titulo = $2, sinopsis = $3, url_pelicula = $4, 
                 anio_estreno = $5, id_genero = $6, id_director = $7, 
                 id_productora = $8, id_tipo = $9,
                 fecha_actualizacion = CURRENT_TIMESTAMP
             WHERE id = $10
        `;
        return await this.executeUpdate(sql, [
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
        ]);
    }

    static async deleteMedia(id) {
        const sql = 'UPDATE media SET estado = 0 WHERE id = $1';
        return await this.executeUpdate(sql, [id]);
    }

    // ==================== MÉTODOS AUXILIARES ====================
    static async verificarExistencia(tabla, id) {
        const results = await this.executeQuery(
            `SELECT id FROM ${tabla} WHERE id = $1 AND estado = 1`,
            [id]
        );
        return results.length > 0;
    }
}

module.exports = Database;