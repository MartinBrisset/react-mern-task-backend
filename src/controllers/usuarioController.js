const Usuario = require('../models/Usuario')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


const controller = {
    
    crearUsuario: (req, res) => {
        let datos = req.body

        let {nombre, correo, clave} = datos

        try {
            var validar_nombre = !validator.isEmpty(nombre) && !validator.isNumeric(nombre)
            var validar_correo = !validator.isEmpty(correo) && validator.isEmail(correo)
            var validar_clave = !validator.isEmpty(clave) && validator.isByteLength(clave, {min: 8})
        } catch (error) {
            return res.status(404).send({                
                message: 'faltan datos en la peticion',
                datos_solicitados: {
                    nombre: 'string',
                    correo: 'email',
                    clave: 'password'
                },
                datos_enviados: datos
            });
        }
        if (validar_nombre && validar_correo && validar_clave) {
            let usuario = new Usuario({
                nombre : nombre.replace(/[<>/'"-?_=+@]+/g, ''),
                correo: datos.correo,
                clave: bcrypt.hashSync(datos.clave, 10),
            })
            usuario.save((error, usuarioDB) => {
                if (error) {
                    return res.status(400).json({
                        ok: false,
                        error: error.message
                    })
                }

                res.json({
                    ok: true,
                    message: 'Usuario creado correctamente',
                    usuario: usuarioDB
                })
            })
        } else {
            return res.status(404).send({
                ok: false,
                message: 'existe un error en los datos, comprobar si los datos estan vacios y si el correo esta bien escrito y la clave debe contener al menos 8 caracteres',
                data: {
                    correo: validar_correo,
                    clave: validar_clave,
                    nombre: validar_nombre
                }
            })
        }

    },

    login: (req, res) => {
        let datos = req.body
        let {correo, clave} = datos
        try {
            var validar_correo = !validator.isEmpty(correo)
            var validar_clave = !validator.isEmpty(clave)
        } catch (error) {
            return res.status(404).send({                
                message: 'faltan datos en la peticion',
                datos_solicitados: {
                    correo: 'email',
                    clave: 'password'
                },
                datos_enviados: datos
            });
        }
        if (validar_clave && validar_correo) {
            
            Usuario.findOne({correo}, (error, usuarioDB) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        error
                    })
                }
                if (!usuarioDB) {
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: 'Usuario o clave incorrectos'
                        }
                    })
                }
                if (!bcrypt.compareSync( clave, usuarioDB.clave )) {
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: 'Usuario o clave incorrectos'
                        }
                    })
                } 
                
                // generar token
                let token = jwt.sign({
                    uid: usuarioDB._id
                }, process.env.AUTENTICACION_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN })

                console.log(`Usuario ${usuarioDB.correo} ha iniciardo sesion`);
                
                return res.json({
                    ok: true,
                    token,
                    usuario: {
                        nombre: usuarioDB.nombre,
                        correo: usuarioDB.correo
                    }
                })            
                
            })

        } else {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Faltan datos'
                }
            })
        }
    },

}

module.exports = controller