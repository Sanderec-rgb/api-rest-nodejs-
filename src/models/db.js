/**
 * Modelo de datos - Versión Experta para TiDB Cloud & Render
 * Este archivo ha sido optimizado para evitar errores de columnas inexistentes.
 */
const pool = require('../config/database');

class Database {
    // Método genérico para ejecutar consultas con log de diagnóstico
    static async executeQuery(sql, params = []) {
        try {
            const [rows] = await pool.query(sql, params);
            return rows;
        } catch (error) {
            console.error('--- ❌ ERROR SQL DETECTADO ---');
            console.error('Query:', sql);
            console.error('Mensaje:', error.message);
            throw new Error(`Error en base de datos: ${error.message}`);
        }
    }

    static async executeInsert(sql, params = []) {
        try {
            const [result] = await pool.query(sql, params);
            return result.insertId || null;
        } catch (error) {
            throw new Error(`Error en el registro: ${error.message}`);
        }
    }

    static async executeUpdate(sql, params = []) {
        try {
            const [result] = await pool.query(sql, params);
            return result.affectedRows;
        } catch (error) {
            throw new Error(`Error en la actualización: ${error.message}`);
        }
    }

    // ==================== MÓDULO MEDIA (ESTRUCTURA REAL) ====================
    static async getAllMedia() {
        // Consultamos solo lo esencial para asegurar que funcione.
        // Si TiDB usa 'genero_id' en lugar de 'id_genero', esta consulta lo maneja.
        return await this.executeQuery(`
            SELECT 
                m.id, 
                m.serial, 
                m.titulo, 
                m.sinopsis, 
                m.url_pelicula,
                m.anio_estreno
            FROM media m
            ORDER BY m.id DESC
        `);
    }

    static async getMediaById(id) {
        return await this.executeQuery(
            'SELECT * FROM media WHERE id = ?',
            [id]
        ).then(res => res[0]);
    }

    // ==================== MÓDULOS DE SOPORTE (LIMPIOS) ====================
    static async getAllGeneros() {
        return await this.executeQuery('SELECT * FROM genero ORDER BY nombre');
    }

    static async getAllDirectores() {
        return await this.executeQuery('SELECT * FROM director ORDER BY apellidos');
    }

    static async getAllProductoras() {
        return await this.executeQuery('SELECT * FROM productora ORDER BY nombre');
    }

    static async getAllTipos() {
        return await this.executeQuery('SELECT * FROM tipo ORDER BY nombre');
    }

    // ==================== OPERACIONES CRUD MEDIA ====================
    static async createMedia(media) {
        const sql = `
            INSERT INTO media (serial, titulo, sinopsis, url_pelicula, anio_estreno) 
            VALUES (?, ?, ?, ?, ?)
        `;
        return await this.executeInsert(sql, [
            media.serial, media.titulo, media.sinopsis, media.url_pelicula, media.anio_estreno
        ]);
    }

    static async deleteMedia(id) {
        // En lugar de update estado=0, hacemos un DELETE físico para evitar el error de columna 'estado'
        const sql = 'DELETE FROM media WHERE id = ?';
        return await this.executeUpdate(sql, [id]);
    }
}

module.exports = Database;