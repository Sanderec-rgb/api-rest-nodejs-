/**
 * Modelo de datos corregido para TiDB Cloud
 */
const pool = require('../config/database');

class Database {
    static async executeQuery(sql, params = []) {
        try {
            const [rows] = await pool.query(sql, params);
            return rows;
        } catch (error) {
            console.error('--- ERROR SQL ---', error.message);
            throw new Error(`Error en base de datos: ${error.message}`);
        }
    }

    static async executeInsert(sql, params = []) {
        try {
            const [result] = await pool.query(sql, params);
            return result.insertId || null;
        } catch (error) {
            throw new Error(`Error en base de datos: ${error.message}`);
        }
    }

    static async executeUpdate(sql, params = []) {
        try {
            const [result] = await pool.query(sql, params);
            return result.affectedRows;
        } catch (error) {
            throw new Error(`Error en base de datos: ${error.message}`);
        }
    }

    // ==================== MÓDULO MEDIA (CORREGIDO) ====================
    static async getAllMedia() {
        // Eliminamos m.fecha_creacion del SELECT y del ORDER BY para evitar el error
        return await this.executeQuery(`
            SELECT 
                m.id, m.serial, m.titulo, m.sinopsis, m.url_pelicula,
                m.anio_estreno, m.estado,
                g.nombre as genero_nombre,
                d.nombres as director_nombres, d.apellidos as director_apellidos,
                p.nombre as productora_nombre,
                t.nombre as tipo_nombre
            FROM media m
            LEFT JOIN genero g ON m.id_genero = g.id
            LEFT JOIN director d ON m.id_director = d.id
            LEFT JOIN productora p ON m.id_productora = p.id
            LEFT JOIN tipo t ON m.id_tipo = t.id
            WHERE m.estado = 1
            ORDER BY m.id DESC
        `);
    }

    // ==================== MÓDULO GÉNERO (CORREGIDO) ====================
    static async getAllGeneros() {
        return await this.executeQuery(
            'SELECT id, nombre, estado FROM genero WHERE estado = 1 ORDER BY nombre'
        );
    }

    // ==================== MÓDULO DIRECTOR (CORREGIDO) ====================
    static async getAllDirectores() {
        return await this.executeQuery(
            'SELECT id, nombres, apellidos, nacionalidad, estado FROM director WHERE estado = 1 ORDER BY apellidos, nombres'
        );
    }

    // Resto de métodos... (Asegúrate de quitar fecha_creacion de los SELECT si te da error en otros módulos)
    // ==================== MÓDULO MEDIA (VERSIÓN SEGURA) ====================
    static async getAllMedia() {
        // Hemos quitado m.estado y m.fecha_creacion para evitar errores de columnas inexistentes
        return await this.executeQuery(`
            SELECT 
                m.id, 
                m.serial, 
                m.titulo, 
                m.sinopsis, 
                m.url_pelicula,
                m.anio_estreno,
                g.nombre as genero_nombre,
                d.nombres as director_nombres, 
                d.apellidos as director_apellidos,
                p.nombre as productora_nombre,
                t.nombre as tipo_nombre
            FROM media m
            LEFT JOIN genero g ON m.id_genero = g.id
            LEFT JOIN director d ON m.id_director = d.id
            LEFT JOIN productora p ON m.id_productora = p.id
            LEFT JOIN tipo t ON m.id_tipo = t.id
            ORDER BY m.id DESC
        `);
    }
    static async getMediaById(id) {
        const results = await this.executeQuery(`
            SELECT 
                m.id, m.serial, m.titulo, m.sinopsis, m.url_pelicula,
                m.anio_estreno, m.estado,
                g.nombre as genero_nombre,
                d.nombres, d.apellidos,
                p.nombre as productora_nombre,
                t.nombre as tipo_nombre
            FROM media m
            LEFT JOIN genero g ON m.id_genero = g.id
            LEFT JOIN director d ON m.id_director = d.id
            LEFT JOIN productora p ON m.id_productora = p.id
            LEFT JOIN tipo t ON m.id_tipo = t.id
            WHERE m.id = ? AND m.estado = 1
        `, [id]);
        return results[0];
    }
}

module.exports = Database;