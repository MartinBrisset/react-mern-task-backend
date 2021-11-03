const Usuario = require('../models/Usuario')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


const controller = {
    
    crearUsuario: (req, res) => {
        let datos = req.body

        let {nombre, email, password} = datos

        try {
            var validar_nombre = !validator.isEmpty(nombre) && !validator.isNumeric(nombre)
            var validar_email = !validator.isEmpty(email) && validator.isEmail(email)
            var validar_password = !validator.isEmpty(password) && validator.isByteLength(password, {min: 8})
        } catch (error) {
            return res.status(404).send({                
                message: 'faltan datos en la peticion',
                datos_solicitados: {
                    nombre: 'string',
                    email: 'email',
                    password: 'password'
                },
                datos_enviados: datos
            });
        }
        if (validar_nombre && validar_email && validar_password) {
            let usuario = new Usuario({
                nombre : nombre.replace(/[<>/'"-?_=+@]+/g, ''),
                email: datos.email,
                password: bcrypt.hashSync(datos.password, 10),
            })
            usuario.save((error, usuarioDB) => {
                if (error) {
                    return res.status(400).json({
                        ok: false,
                        error: error.message,
                        msg: 'Usuario ya existe'
                    })
                }
                // generar token
                let token = jwt.sign({
                    uid: usuarioDB._id
                }, process.env.AUTENTICACION_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN })

                console.log(`Usuario ${usuarioDB.correo} fue registrado y ha iniciardo sesion`);
                

                res.json({
                    ok: true,
                    message: 'Usuario creado correctamente',
                    usuario: {
                        nombre: usuarioDB.nombre,
                        email: usuarioDB.email,
                        uid: usuarioDB._id
                    },
                    token
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
        let {email, password} = datos
        try {
            var validar_email = !validator.isEmpty(email)
            var validar_password = !validator.isEmpty(password)
        } catch (error) {
            return res.status(404).send({                
                message: 'faltan datos en la peticion',
                datos_solicitados: {
                    email: 'email',
                    password: 'password'
                },
                datos_enviados: datos
            });
        }
        if (validar_password && validar_email) {
            
            Usuario.findOne({email}, (error, usuarioDB) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        error
                    })
                }
                if (!usuarioDB) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Usuario o password incorrectos',
                    })
                }
                if (!bcrypt.compareSync( password, usuarioDB.password )) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Usuario o password incorrectos',
                    })
                } 
                
                // generar token
                let token = jwt.sign({
                    uid: usuarioDB._id
                }, process.env.AUTENTICACION_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN })

                console.log(`Usuario ${usuarioDB.email} ha iniciardo sesion`);
                
                return res.json({
                    ok: true,
                    token,
                    usuario: {
                        nombre: usuarioDB.nombre,
                        email: usuarioDB.email
                    },
                    msg: 'Usuario autenticado correctamente'
                })            
                
            })
        } else {
            return res.status(400).json({
                ok: false,
                msg: 'Faltan datos'
            })
        }
    },

    usuarioAutenticado: async (req, res) => {
        try {
            const usuario = await Usuario.findById(req.userData._id).select('-password')
            res.json({
                usuario
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado'
            })
        }
            
     
    }

}

module.exports = controller