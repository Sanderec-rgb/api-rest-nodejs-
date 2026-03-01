# 🎬 API REST - Sistema de Gestión de Películas y Series

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.x-orange)
![License](https://img.shields.io/badge/license-ISC-lightgrey)

## 📋 Descripción del Proyecto

API REST desarrollada con Node.js y Express para la gestión completa de un catálogo de películas y series. Permite administrar géneros, directores, productoras, tipos de contenido y el contenido multimedia en sí mismo.

## 👨‍💻 Autor

**SANDER ENRIQUE CAMARGO OROZCO**  
Proyecto académico - Desarrollo de API REST con Node.js

## 🚀 Características

- ✅ CRUD completo para 5 módulos: Género, Director, Productora, Tipo y Media
- ✅ Borrado lógico (soft delete) en todos los módulos
- ✅ Validaciones de datos en cada operación
- ✅ Manejo de errores consistente
- ✅ Conexión a MySQL con pool de conexiones
- ✅ Documentación de endpoints incluida

## 📦 Tecnologías Utilizadas

- **Node.js** (v18+)
- **Express.js** - Framework web
- **MySQL** - Base de datos (via XAMPP)
- **mysql2** - Conector MySQL
- **dotenv** - Variables de entorno
- **cors** - Middleware CORS
- **nodemon** - Desarrollo (reinicio automático)

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- XAMPP (solo MySQL) o MySQL Server
- Postman (para probar la API)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/api-rest-nodejs.git
   cd api-rest-nodejs