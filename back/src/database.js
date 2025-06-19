import mysql from 'promise-mysql'
import dotenv from 'dotenv'
dotenv.config();


let conexion = mysql.createConnection({
host: process.env.host,
database: process.env.database,
user: process.env.user,
password: process.env.password,

})

let obtenerConexion = async ()=> await conexion;

export default {obtenerConexion};