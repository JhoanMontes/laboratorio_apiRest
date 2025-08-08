Claro, aquí tienes una guía paso a paso para estructurar tu proyecto completo con un backend que sigue la arquitectura MVS y un frontend separado que consume sus datos.

📁 Fase 1: Estructura General del Proyecto
Primero, crea la carpeta principal y las dos subcarpetas.

Bash

mkdir mi-proyecto-fullstack
cd mi-proyecto-fullstack
mkdir backend
mkdir frontendv / npm create vite@latest
Tu estructura se verá así:

mi-proyecto-fullstack/
├── backend/
└── frontend/
🖥️ Fase 2: Configuración del Backend (MVS)
Aquí construiremos tu API. Navega a la carpeta del backend.

Bash

cd backend
Paso 2.1: Iniciar el proyecto de Node.js e instalar dependencias
Bash

# Inicia un proyecto de Node.js
npm init -y

# Instala las dependencias de producción
npm install express mysql2 dotenv cors

# Instala las dependencias de desarrollo (nodemon para reiniciar el servidor automáticamente)
npm install nodemon --save-dev
cors: Es un paquete crucial que permite que tu frontend (que corre en un origen diferente) pueda hacerle peticiones a tu backend sin ser bloqueado por el navegador por seguridad.

Paso 2.2: Configurar el script de inicio
Abre tu package.json y dentro de "scripts", añade lo siguiente para poder iniciar tu servidor fácilmente.

JSON

"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
Paso 2.3: Crear la estructura de carpetas y archivos MVS
Ahora, crea las carpetas y archivos que contendrán tu lógica.

Bash

# Crea las carpetas
mkdir controllers models services routes

# Crea los archivos principales
touch index.js db.js .env
Tu carpeta backend ahora se ve así:

backend/
├── controllers/
├── models/
├── routes/
├── services/
├── node_modules/
├── index.js
├── db.js
├── package.json
├── package-lock.json
└── .env
Paso 2.4: Escribir el código de cada capa
1. Archivo .env (Tus secretos)

Fragmento de código

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_DATABASE=nombre_de_tu_bd
2. Archivo db.js (Conexión a la BD)

JavaScript

const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise(); // ¡Importante! .promise() para poder usar async/await

module.exports = connection;
3. Archivo models/producto.model.js (CRUD con la BD)

JavaScript

const db = require('../db');

const Producto = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM productos');
    return rows;
  },
  create: async (data) => {
    const [result] = await db.query('INSERT INTO productos SET ?', [data]);
    return { id: result.insertId, ...data };
  }
  // Aquí irían los métodos para getById, update, delete...
};

module.exports = Producto;
4. Archivo services/producto.service.js (Lógica de negocio)

JavaScript

const ProductoModel = require('../models/producto.model');

const ProductoService = {
  getAll: async () => {
    return ProductoModel.getAll();
  },
  create: async (data) => {
    if (!data.nombre || data.precio <= 0) {
      throw new Error('Datos inválidos: El nombre es obligatorio y el precio debe ser mayor a cero.');
    }
    return ProductoModel.create(data);
  }
};

module.exports = ProductoService;
5. Archivo controllers/producto.controller.js (Manejo de req/res)

JavaScript

const ProductoService = require('../services/producto.service');

exports.getAllProductos = async (req, res) => {
  try {
    const productos = await ProductoService.getAll();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProducto = async (req, res) => {
  try {
    const producto = await ProductoService.create(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
6. Archivo routes/producto.routes.js (Endpoints de la API)

JavaScript

const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');

router.get('/', productoController.getAllProductos);
router.post('/', productoController.createProducto);

module.exports = router;
7. Archivo index.js (El corazón del servidor)

JavaScript

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Importar cors

dotenv.config();

const productoRoutes = require('./routes/producto.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Usar cors para permitir peticiones del frontend
app.use(express.json()); // Para entender los JSON que envía el frontend

// Rutas
app.use('/api/productos', productoRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
¡Listo! Tu backend está completo.

🎨 Fase 3: Configuración del Frontend (Básico)
Ahora, vamos a crear una interfaz simple para consumir la API.

Bash

# Regresa a la carpeta raíz y entra al frontend
cd ../frontend
Paso 3.1: Crear los archivos HTML y JavaScript
Bash

touch index.html app.js
Paso 3.2: Escribir el código
1. Archivo index.html (La estructura visual)

HTML

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Productos</title>
    <style>body { font-family: sans-serif; container {max-width: 600px; margin: auto; padding: 20px;} }</style>
</head>
<body>
    <div class="container">
        <h1>Gestión de Productos</h1>

        <h2>Añadir Producto</h2>
        <form id="form-producto">
            <input type="text" id="nombre" placeholder="Nombre del producto" required>
            <input type="number" id="precio" placeholder="Precio" step="0.01" required>
            <button type="submit">Guardar</button>
        </form>

        <h2>Lista de Productos</h2>
        <ul id="lista-productos">
            </ul>
    </div>

    <script src="app.js"></script>
</body>
</html>
2. Archivo app.js (La lógica para hablar con el backend)

JavaScript

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-producto');
    const lista = document.getElementById('lista-productos');
    const API_URL = 'http://localhost:3000/api/productos'; // URL de tu API backend

    // Función para cargar los productos
    const cargarProductos = async () => {
        const response = await fetch(API_URL);
        const productos = await response.json();
        lista.innerHTML = ''; // Limpiar la lista
        productos.forEach(p => {
            const li = document.createElement('li');
            li.textContent = `${p.nombre} - $${p.precio}`;
            lista.appendChild(li);
        });
    };

    // Función para crear un producto
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const precio = document.getElementById('precio').value;

        await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, precio })
        });
        
        form.reset(); // Limpiar el formulario
        cargarProductos(); // Volver a cargar la lista actualizada
    });

    // Cargar los productos al iniciar la página
    cargarProductos();
});
🚀 Fase 4: Poner todo en Marcha
Necesitarás dos terminales abiertas.

En la Terminal 1 (para el Backend):

Bash

cd mi-proyecto-fullstack/backend
npm run dev
Verás el mensaje: 🚀 Servidor backend corriendo en http://localhost:3000
