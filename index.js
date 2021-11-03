require('dotenv').config({ path: 'vars.env'})
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

//iniciar express
const app = express();

//importar rutas
const public_rutas = require('./src/routes/publicas')
const user_rutas = require('./src/routes/usuarios')
const proyect_rutas = require('./src/routes/proyectos')
const tarea_routas = require('./src/routes/tareas')

//middlewares
app.use(morgan('dev')); //muestra la ruta en la consola

// app.use(express.urlencoded({extended:true}))
app.use(express.json()) 
app.use(cors())

// rutas
app.use('/', public_rutas)
app.use('/api/usuarios', user_rutas )
app.use('/api/proyectos', proyect_rutas )
app.use('/api/tareas', tarea_routas)

// base de datos
require('./src/config/db')

//arrancar el servidor
app.listen(process.env.PORT,() => {
    console.log(`server en puerto ${process.env.PORT}`);
});
