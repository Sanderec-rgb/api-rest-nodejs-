const pool = require('./database');

class Database {
    // Ejecutor de consultas con manejo de errores mejorado
    static async executeQuery(sql, params = []) {
        let connection;
        try {
            connection = await pool.getConnection();
            const [rows] = await connection.query(sql, params);
            return rows;
        } catch (error) {
            console.error('❌ Error en consulta SQL:', error.message);
            console.error('SQL:', sql);
            console.error('Params:', params);
            throw new Error(`Error en base de datos: ${error.message}`);
        } finally {
            if (connection) connection.release();
        }
    }

    // Obtener todos los medios (SOLO columnas que existen)
    static async getAllMedia() {
        const sql = `
            SELECT 
                id, 
                serial, 
                titulo, 
                sinopsis, 
                url_pelicula, 
                anio_estreno,
                created_at,
                updated_at
            FROM media 
            ORDER BY id DESC
        `;
        return await this.executeQuery(sql);
    }

    // Obtener medio por ID
    static async getMediaById(id) {
        const sql = `
            SELECT 
                id, 
                serial, 
                titulo, 
                sinopsis, 
                url_pelicula, 
                anio_estreno,
                created_at,
                updated_at
            FROM media 
            WHERE id = ?
        `;
        const results = await this.executeQuery(sql, [id]);
        return results[0] || null;
    }

    // Obtener catálogos
    static async getAllGeneros() {
        try {
            return await this.executeQuery('SELECT * FROM genero ORDER BY nombre');
        } catch (error) {
            console.warn('⚠️ Error al obtener géneros:', error.message);
            return [];
        }
    }

    static async getAllDirectores() {
        try {
            return await this.executeQuery('SELECT * FROM director ORDER BY nombre');
        } catch (error) {
            console.warn('⚠️ Error al obtener directores:', error.message);
            return [];
        }
    }

    static async getAllProductoras() {
        try {
            return await this.executeQuery('SELECT * FROM productora ORDER BY nombre');
        } catch (error) {
            console.warn('⚠️ Error al obtener productoras:', error.message);
            return [];
        }
    }

    static async getAllTipos() {
        try {
            return await this.executeQuery('SELECT * FROM tipo ORDER BY nombre');
        } catch (error) {
            console.warn('⚠️ Error al obtener tipos:', error.message);
            return [];
        }
    }

    // Crear nuevo medio
    static async createMedia(media) {
        const sql = `
            INSERT INTO media (
                serial, 
                titulo, 
                sinopsis, 
                url_pelicula, 
                anio_estreno
            ) VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(sql, [
            media.serial,
            media.titulo,
            media.sinopsis,
            media.url_pelicula,
            media.anio_estreno
        ]);
        return result.insertId;
    }

    // Actualizar medio existente
    static async updateMedia(id, media) {
        const sql = `
            UPDATE media 
            SET serial = ?, 
                titulo = ?, 
                sinopsis = ?, 
                url_pelicula = ?, 
                anio_estreno = ?
            WHERE id = ?
        `;
        const [result] = await pool.query(sql, [
            media.serial,
            media.titulo,
            media.sinopsis,
            media.url_pelicula,
            media.anio_estreno,
            id
        ]);
        return result.affectedRows;
    }

    // Eliminar medio
    static async deleteMedia(id) {
        const sql = 'DELETE FROM media WHERE id = ?';
        const [result] = await pool.query(sql, [id]);
        return result.affectedRows;
    }
}

module.exports = Database;