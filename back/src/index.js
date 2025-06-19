import express from 'express';
import morgan from 'morgan';


// CONFIGURACION
let app = express();
app.use(express.json());
app.set('port', 8003);
app.listen(app.get('port'), () => {
    console.log(`API escuchando en http://localhost:${app.get('port')}`);
})

// MIDDLEWARES
app.use(morgan('dev'));

// RUTAS

app.get('/', (req, res) => {
    res.send('Bienvenido a API Interpolice');
})


app.get('/usuarios', (req, res) => {
    res.json([
        {
            id: 1,
            nombre: 'Juan',
            email: 'juan@gmail.com'
        },
        {
            id: 2,
            nombre: 'Pedro',
            email: 'pedro@gmail.com'
        },
        {
            id: 3,
            nombre: 'Ana',
            email: 'ana@gmail.com'
        }
      
        
    ])
})
