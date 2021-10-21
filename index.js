const express = require('express');
const morgan = require('morgan');

//iniciar express
const app = express();

//importar rutas
const public_rutas = require('./src/routes/publicas')

//middlewares
app.use(morgan('dev')); //muestra la ruta en la consola

// rutas
app.use('/', public_rutas)

const PORT = process.env.PORT || 4000

//arrancar el servidor
app.listen(PORT,() => {
    console.log(`server en puerto ${PORT}`);
});
