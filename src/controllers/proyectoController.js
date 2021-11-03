const Proyecto = require('../models/Proyecto')
const validator = require('validator')


const controller = {
    
    crearProyecto: (req, res) => {
        let datos = req.body

        let {nombre} = datos
        let creador = req.userData._id

        try {
            var validar_nombre = !validator.isEmpty(nombre) && !validator.isNumeric(nombre)
        } catch (error) {
            return res.status(404).send({                
                message: 'faltan datos en la peticion',
                datos_solicitados: {
                    nombre: 'string',
                },
                datos_enviados: datos
            });
        }
        if (validar_nombre) {
            let proyecto = new Proyecto({
                nombre : nombre.replace(/[<>/'"-?_=+@]+/g, ''),
                creador
            })
            proyecto.save((error, proyectoDB) => {
                if (error) {
                    return res.status(400).json({
                        ok: false,
                        error: error.message
                    })
                }

                res.json({
                    ok: true,
                    message: 'Proyecto creado correctamente',
                    proyecto: proyectoDB.nombre
                })
            })
        } else {
            return res.status(404).send({
                ok: false,
                message: 'existe un error en los datos, comprobar si los datos estan vacios',
                data: {
                    nombre: validar_nombre
                }
            })
        }

    },

    verMisProyectos: (req, res) => {

        let creador = req.userData._id

        let desde = req.query.desde || 0;
        desde = Number(desde)

        let limite = req.query.limite || 5;
        limite = Number(limite)

        Proyecto.find({creador:creador}) 
            .skip(desde)
            .limit(limite)
            .populate('creador', 'nombre')
            .exec((error, proyectoDB) => {
                if (error) {
                console.log(error);
                return res.status(400).json({
                    ok: false,
                    message: 'Ocurrio un error al consultar los proyectos'
                })
            }
            if (!proyectoDB) {
                return res.status(200).json({
                    ok: false,
                    message: 'No tienes proyectos creados'
                }) 
            }
            return res.json({
                ok: true,
                proyectos: proyectoDB
            })
        })
        
    },

    editarProyecto: (req, res) => {
        //capturar id del proyecto
        const idProyecto = req.params.id
        //capturar datos
        const {nombre} = req.body
        //usuario conectado
        let creador = req.userData._id
        // Validar datos y crear objeto
        if (!nombre) {
            return res.status(400).json({
                ok: false,
                error: 'No se encontro el nombre a actualizar'
            })
        }
        let proyecto = {
            nombre
        }
        Proyecto.findOneAndUpdate({_id:idProyecto, creador:creador}, proyecto, {new:true, context: 'query'},(error, proyectoDB) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error: `No existe el ID: ${idProyecto} en los proyectos`
                })
            }
            if (!proyectoDB) {
                return res.status(400).json({
                    ok: false,
                    error: 'No tienen permisos para actualizar este proyecto',
                }) 
            }
            return res.json({
                ok: true,
                proyectoDB
            })
        })
    },
    
    eliminarProyecto: (req, res) => {
        //capturar id del proyecto
        const idProyecto = req.params.id
        //usuario conectado
        let creador = req.userData._id
        Proyecto.findOneAndDelete({_id:idProyecto, creador:creador},(error, proyectoDB) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error: `No existe un proyecto con el ID: ${idProyecto}`
                })
            }
            if (!proyectoDB) {
                return res.status(400).json({
                    ok: false,
                    error: `No tienes permisos para elminar este proyecto`
                }) 
            }
            return res.json({
                ok: true,
                message: 'Proyecto eliminado',
            })
        })
    },


}

module.exports = controller