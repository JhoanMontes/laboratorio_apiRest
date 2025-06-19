import express from 'express';
import morgan from 'morgan';
import database from './database.js';
import cors from 'cors'

// CONFIGURACION
let app = express();
app.use(express.json());
app.set('port', 8003);
app.listen(app.get('port'), () => {
    console.log(`API escuchando en http://localhost:${app.get('port')}`);
})

// MIDDLEWARES

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://127.0.0.1:5501']
}))
app.use(morgan('dev'));

// RUTAS

app.get('/', (req, res) => {
    res.send('Bienvenido a API Interpolice');
})


app.get('/usuarios', async (req, res) => {
    let conexion = await database.obtenerConexion()
    let resultado = await conexion.query('SELECT * FROM ciudadano');
    res.json(resultado)
})
