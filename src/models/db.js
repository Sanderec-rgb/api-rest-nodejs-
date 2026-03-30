const pool = require('../config/database');

class Database {
    static async query(sql, params = []) {
        try {
            const [rows] = await pool.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('❌ Error SQL:', error.message);
            console.error('SQL:', sql);
            throw error;
        }
    }

    // ============== MEDIA ==============
    
    static async getAllMedia() {
        try {
            // Primero, obtener la estructura de la tabla media
            const [columns] = await pool.query('SHOW COLUMNS FROM media');
            const columnNames = columns.map(c => c.Field);
            
            // Verificar qué columnas existen
            const hasEstado = columnNames.includes('estado');
            const hasFechaCreacion = columnNames.includes('fecha_creacion');
            
            // Construir la consulta dinámicamente
            let sql = `
                SELECT 
                    m.id,
                    m.serial,
                    m.titulo,
                    m.sinopsis,
                    m.url_pelicula,
                    m.anio_estreno
            `;
            
            if (hasFechaCreacion) sql += `, m.fecha_creacion`;
            if (hasEstado) sql += `, m.estado`;
            
            sql += `,
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
            `;
            
            if (hasEstado) sql += ` WHERE m.estado = 1`;
            
            sql += ` ORDER BY m.id DESC`;
            
            return await this.query(sql);
        } catch (error) {
            console.error('Error en getAllMedia:', error);
            // Si falla, intentar consulta simple
            return await this.query('SELECT * FROM media ORDER BY id DESC');
        }
    }

    static async getMediaById(id) {
        try {
            const sql = `
                SELECT 
                    m.*,
                    g.nombre AS genero_nombre,
                    CONCAT(d.nombres, ' ', d.apellidos) AS director_nombre,
                    p.nombre AS productora_nombre,
                    t.nombre AS tipo_nombre
                FROM media m
                LEFT JOIN genero g ON m.id_genero = g.id
                LEFT JOIN director d ON m.id_director = d.id
                LEFT JOIN productora p ON m.id_productora = p.id
                LEFT JOIN tipo t ON m.id_tipo = t.id
                WHERE m.id = ?
            `;
            const rows = await this.query(sql, [id]);
            return rows[0] || null;
        } catch (error) {
            console.error('Error en getMediaById:', error);
            const rows = await this.query('SELECT * FROM media WHERE id = ?', [id]);
            return rows[0] || null;
        }
    }

    static async createMedia(data) {
        // Obtener columnas de la tabla
        const [columns] = await pool.query('SHOW COLUMNS FROM media');
        const columnNames = columns.map(c => c.Field);
        
        // Construir consulta dinámica
        const fields = [];
        const values = [];
        const placeholders = [];
        
        if (columnNames.includes('serial')) {
            fields.push('serial');
            values.push(data.serial);
            placeholders.push('?');
        }
        if (columnNames.includes('titulo')) {
            fields.push('titulo');
            values.push(data.titulo);
            placeholders.push('?');
        }
        if (columnNames.includes('sinopsis')) {
            fields.push('sinopsis');
            values.push(data.sinopsis || null);
            placeholders.push('?');
        }
        if (columnNames.includes('url_pelicula')) {
            fields.push('url_pelicula');
            values.push(data.url_pelicula || null);
            placeholders.push('?');
        }
        if (columnNames.includes('anio_estreno')) {
            fields.push('anio_estreno');
            values.push(data.anio_estreno || null);
            placeholders.push('?');
        }
        if (columnNames.includes('id_genero')) {
            fields.push('id_genero');
            values.push(data.id_genero || null);
            placeholders.push('?');
        }
        if (columnNames.includes('id_director')) {
            fields.push('id_director');
            values.push(data.id_director || null);
            placeholders.push('?');
        }
        if (columnNames.includes('id_productora')) {
            fields.push('id_productora');
            values.push(data.id_productora || null);
            placeholders.push('?');
        }
        if (columnNames.includes('id_tipo')) {
            fields.push('id_tipo');
            values.push(data.id_tipo || null);
            placeholders.push('?');
        }
        if (columnNames.includes('estado')) {
            fields.push('estado');
            values.push(1);
            placeholders.push('?');
        }
        
        const sql = `INSERT INTO media (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`;
        const [result] = await pool.execute(sql, values);
        return result.insertId;
    }

    static async updateMedia(id, data) {
        // Obtener columnas de la tabla
        const [columns] = await pool.query('SHOW COLUMNS FROM media');
        const columnNames = columns.map(c => c.Field);
        
        // Construir SET dinámico
        const sets = [];
        const values = [];
        
        const updateFields = ['serial', 'titulo', 'sinopsis', 'url_pelicula', 'anio_estreno', 
                              'id_genero', 'id_director', 'id_productora', 'id_tipo'];
        
        for (const field of updateFields) {
            if (columnNames.includes(field) && data[field] !== undefined) {
                sets.push(`${field} = ?`);
                values.push(data[field]);
            }
        }
        
        if (columnNames.includes('fecha_actualizacion')) {
            sets.push(`fecha_actualizacion = NOW()`);
        }
        
        values.push(id);
        const sql = `UPDATE media SET ${sets.join(', ')} WHERE id = ?`;
        const [result] = await pool.execute(sql, values);
        return result.affectedRows;
    }

    static async deleteMedia(id) {
        // Verificar si existe columna estado
        const [columns] = await pool.query('SHOW COLUMNS FROM media');
        const columnNames = columns.map(c => c.Field);
        
        if (columnNames.includes('estado')) {
            const sql = 'UPDATE media SET estado = 0 WHERE id = ?';
            const [result] = await pool.execute(sql, [id]);
            return result.affectedRows;
        } else {
            const sql = 'DELETE FROM media WHERE id = ?';
            const [result] = await pool.execute(sql, [id]);
            return result.affectedRows;
        }
    }

    // ============== GÉNEROS ==============
    
    static async getAllGeneros() {
        try {
            const [columns] = await pool.query('SHOW COLUMNS FROM genero');
            const columnNames = columns.map(c => c.Field);
            
            let sql = 'SELECT id, nombre FROM genero';
            if (columnNames.includes('estado')) sql += ' WHERE estado = 1';
            sql += ' ORDER BY nombre';
            
            return await this.query(sql);
        } catch (error) {
            return await this.query('SELECT id, nombre FROM genero ORDER BY nombre');
        }
    }

    static async getGeneroById(id) {
        try {
            const [columns] = await pool.query('SHOW COLUMNS FROM genero');
            const columnNames = columns.map(c => c.Field);
            
            let sql = 'SELECT id, nombre FROM genero WHERE id = ?';
            if (columnNames.includes('estado')) sql += ' AND estado = 1';
            
            const rows = await this.query(sql, [id]);
            return rows[0] || null;
        } catch (error) {
            const rows = await this.query('SELECT id, nombre FROM genero WHERE id = ?', [id]);
            return rows[0] || null;
        }
    }

    static async createGenero(data) {
        const [columns] = await pool.query('SHOW COLUMNS FROM genero');
        const columnNames = columns.map(c => c.Field);
        
        if (columnNames.includes('estado')) {
            const [result] = await pool.execute('INSERT INTO genero (nombre, estado) VALUES (?, 1)', [data.nombre]);
            return result.insertId;
        } else {
            const [result] = await pool.execute('INSERT INTO genero (nombre) VALUES (?)', [data.nombre]);
            return result.insertId;
        }
    }

    static async updateGenero(id, data) {
        const [result] = await pool.execute('UPDATE genero SET nombre = ? WHERE id = ?', [data.nombre, id]);
        return result.affectedRows;
    }

    static async deleteGenero(id) {
        const [columns] = await pool.query('SHOW COLUMNS FROM genero');
        const columnNames = columns.map(c => c.Field);
        
        if (columnNames.includes('estado')) {
            const [result] = await pool.execute('UPDATE genero SET estado = 0 WHERE id = ?', [id]);
            return result.affectedRows;
        } else {
            const [result] = await pool.execute('DELETE FROM genero WHERE id = ?', [id]);
            return result.affectedRows;
        }
    }

    // ============== DIRECTORES ==============
    
    static async getAllDirectores() {
        try {
            const [columns] = await pool.query('SHOW COLUMNS FROM director');
            const columnNames = columns.map(c => c.Field);
            
            let sql = 'SELECT id, nombres, apellidos, nacionalidad FROM director';
            if (columnNames.includes('estado')) sql += ' WHERE estado = 1';
            sql += ' ORDER BY nombres, apellidos';
            
            return await this.query(sql);
        } catch (error) {
            return await this.query('SELECT id, nombres, apellidos, nacionalidad FROM director ORDER BY nombres, apellidos');
        }
    }

    static async getDirectorById(id) {
        const rows = await this.query('SELECT id, nombres, apellidos, nacionalidad FROM director WHERE id = ?', [id]);
        return rows[0] || null;
    }

    static async createDirector(data) {
        const [result] = await pool.execute('INSERT INTO director (nombres, apellidos, nacionalidad) VALUES (?, ?, ?)', 
            [data.nombres, data.apellidos, data.nacionalidad || null]);
        return result.insertId;
    }

    static async updateDirector(id, data) {
        const [result] = await pool.execute('UPDATE director SET nombres = ?, apellidos = ?, nacionalidad = ? WHERE id = ?',
            [data.nombres, data.apellidos, data.nacionalidad || null, id]);
        return result.affectedRows;
    }

    static async deleteDirector(id) {
        const [columns] = await pool.query('SHOW COLUMNS FROM director');
        const columnNames = columns.map(c => c.Field);
        
        if (columnNames.includes('estado')) {
            const [result] = await pool.execute('UPDATE director SET estado = 0 WHERE id = ?', [id]);
            return result.affectedRows;
        } else {
            const [result] = await pool.execute('DELETE FROM director WHERE id = ?', [id]);
            return result.affectedRows;
        }
    }

    // ============== PRODUCTORAS ==============
    
    static async getAllProductoras() {
        try {
            const [columns] = await pool.query('SHOW COLUMNS FROM productora');
            const columnNames = columns.map(c => c.Field);
            
            let sql = 'SELECT id, nombre, sede_social FROM productora';
            if (columnNames.includes('estado')) sql += ' WHERE estado = 1';
            sql += ' ORDER BY nombre';
            
            return await this.query(sql);
        } catch (error) {
            return await this.query('SELECT id, nombre, sede_social FROM productora ORDER BY nombre');
        }
    }

    static async getProductoraById(id) {
        const rows = await this.query('SELECT id, nombre, sede_social FROM productora WHERE id = ?', [id]);
        return rows[0] || null;
    }

    static async createProductora(data) {
        const [result] = await pool.execute('INSERT INTO productora (nombre, sede_social) VALUES (?, ?)',
            [data.nombre, data.sede_social || null]);
        return result.insertId;
    }

    static async updateProductora(id, data) {
        const [result] = await pool.execute('UPDATE productora SET nombre = ?, sede_social = ? WHERE id = ?',
            [data.nombre, data.sede_social || null, id]);
        return result.affectedRows;
    }

    static async deleteProductora(id) {
        const [columns] = await pool.query('SHOW COLUMNS FROM productora');
        const columnNames = columns.map(c => c.Field);
        
        if (columnNames.includes('estado')) {
            const [result] = await pool.execute('UPDATE productora SET estado = 0 WHERE id = ?', [id]);
            return result.affectedRows;
        } else {
            const [result] = await pool.execute('DELETE FROM productora WHERE id = ?', [id]);
            return result.affectedRows;
        }
    }

    // ============== TIPOS ==============
    
    static async getAllTipos() {
        try {
            const [columns] = await pool.query('SHOW COLUMNS FROM tipo');
            const columnNames = columns.map(c => c.Field);
            
            let sql = 'SELECT id, nombre FROM tipo';
            if (columnNames.includes('estado')) sql += ' WHERE estado = 1';
            sql += ' ORDER BY nombre';
            
            return await this.query(sql);
        } catch (error) {
            return await this.query('SELECT id, nombre FROM tipo ORDER BY nombre');
        }
    }

    static async getTipoById(id) {
        const rows = await this.query('SELECT id, nombre FROM tipo WHERE id = ?', [id]);
        return rows[0] || null;
    }

    static async createTipo(data) {
        const [result] = await pool.execute('INSERT INTO tipo (nombre) VALUES (?)', [data.nombre]);
        return result.insertId;
    }

    static async updateTipo(id, data) {
        const [result] = await pool.execute('UPDATE tipo SET nombre = ? WHERE id = ?', [data.nombre, id]);
        return result.affectedRows;
    }

    static async deleteTipo(id) {
        const [columns] = await pool.query('SHOW COLUMNS FROM tipo');
        const columnNames = columns.map(c => c.Field);
        
        if (columnNames.includes('estado')) {
            const [result] = await pool.execute('UPDATE tipo SET estado = 0 WHERE id = ?', [id]);
            return result.affectedRows;
        } else {
            const [result] = await pool.execute('DELETE FROM tipo WHERE id = ?', [id]);
            return result.affectedRows;
        }
    }
}

module.exports = Database;