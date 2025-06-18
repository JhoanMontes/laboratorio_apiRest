import express from 'express';

let app = express();

app.use(express.json());

let puerto = 8003;

app.listen(puerto, () => {
    console.log(`API escuchando en http://localhost:${puerto}`);
})

// API INICIO
app.get('/', (req, res) => {
    res.send('Bienvenido a API Interpolice');
})

// DB USUARIOS
let usuarios = [
    {codigo: 1, nombre: 'Natalia'}
];

// Obtiene los datos
app.get('/usuarios', (req, res) => {
    res.json(usuarios);
})

// Añadir usuario
app.post('/usuarios', (req, res) => {
    const nuevoUsuario = req.body;

    usuarios.push(nuevoUsuario);
    res.status(201).json(nuevoUsuario);
})

// Actualizar usuario
app.put('/usuarios/:codigo', (req, res) => {
    const codigo = parseInt(req.params.codigo);
    const nuevoNombre = req.body.nombre;

    // Encuentra el usuario
    const usuarioIndex = usuarios.findIndex(u => u.codigo === codigo);
    
    if (usuarioIndex !== -1) {
        usuarios[usuarioIndex].nombre = nuevoNombre;
        return res.json(usuarios[usuarioIndex]);
    } else {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }
})

// Eliminar usuario
app.delete('/usuarios/:codigo', (req, res) => {
    const codigo = parseInt(req.params.codigo);

    if (isNaN(codigo)) {
        return res.status(400).json({ error: "El código debe ser un número válido" });
    }

    // Filtra los usuarios para eliminar el usuario con el código proporcionado
    usuarios = usuarios.filter(u => u.codigo !== codigo);

    // Responde con el estado 204 (sin contenido)
    res.status(204).send();
});
