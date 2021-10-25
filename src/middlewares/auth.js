const jwt = require('jsonwebtoken');

const Usuario = require('../models/Usuario')

let auth = {

    token: (req, res, next) => {
        // return next()
        // comprobar si llega autorizacion
        if(!req.headers.token){
            return res.status(401).send({
                ok: false,
                message: 'No hay token en la petición'
            });
        }
        //limpiar el token de comillas y guardarlo en variable
        let token = req.headers.token.replace(/['"]+/g, '');
        const claveSecreta = process.env.AUTENTICACION_TOKEN
        jwt.verify(token, claveSecreta, (error, decoded) => {
            if (error) {
                console.log(`Token no valido o explirado ${error}`);
                return res.status(401).json({
                    ok: false,
                    message: 'Token no valido o expirado'
                })
            }
            if (!decoded) {
                console.log('Error en decoded');
                return res.status(400).json({
                    ok: false,
                    message: 'Token no valido o expirado'
                }) 
            }
            let idUser = decoded.uid
            Usuario.findById( idUser, (error, usuarioDB) => {
                if (error) {
                    console.log(error);
                    return res.status(400).json({
                        ok: false,
                        message: 'No tienes permiso para acceder al sistema, comuniquere con el administrador - Error de Usuario'
                    })
                } else {
                    console.log(`Usuario ${usuarioDB.correo} trabajando`);
                    req.userData = usuarioDB
                    next();
                }
            })
            
        })
    }
}

module.exports = auth;