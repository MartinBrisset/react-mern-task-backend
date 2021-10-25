const Proyecto = require('../models/Proyecto')
const Tarea = require('../models/Tareas')
const validator = require('validator')


const controller = {
    
    crearTarea: (req, res) => {
        let datos = req.body

        let {nombre, idProyecto} = datos
        let creador = req.userData._id

        try {
            var validar_nombre = !validator.isEmpty(nombre) && !validator.isNumeric(nombre)
            var validar_proyecto = !validator.isEmpty(idProyecto) && validator.isMongoId(idProyecto)
        } catch (error) {
            return res.status(404).send({                
                message: 'faltan datos en la peticion',
                datos_solicitados: {
                    nombre: 'string',
                    proyecto: 'mongoid'
                },
                datos_enviados: datos
            });
        }
        if (validar_nombre && validar_proyecto) {
            //ver si existe el proyecto y si sos el creador
            Proyecto.findOne({_id:idProyecto, creador:creador},(error, proyectoDB) => {
                if (error) {
                    return res.status(400).json({
                        ok: false,
                        error: `No existe el ID: ${idProyecto} en los proyectos`
                    })
                }
                if (!proyectoDB) {
                    return res.status(400).json({
                        ok: false,
                        error: 'No tienen permisos para agregar tareas a este proyecto',
                    }) 
                }
            })
            let tarea = new Tarea({
                nombre : nombre.replace(/[<>/'"-?_=+@]+/g, ''),
                proyecto : idProyecto,
                estado: false
            })
            tarea.save((error, tareaDB) => {
                if (error) {
                    return res.status(400).json({
                        ok: false,
                        error: error.message
                    })
                }

                res.json({
                    ok: true,
                    message: 'Proyecto creado correctamente',
                    tarea: tareaDB
                })
            })
        } else {
            return res.status(404).send({
                ok: false,
                message: 'existe un error en los datos, comprobar si los datos estan vacios',
                data: {
                    nombre: validar_nombre,
                    proyecto: validar_proyecto
                }
            })
        }

    },

    verMisTareasDeUnProyecto: async (req, res) => {

        let creador = req.userData._id

        let idProyecto = req.params.id

        const existeProyecto = await Proyecto.findById(idProyecto)
        if (!existeProyecto) {
            return res.status(400).json({
                ok: false,
                error: `No existe el ID: ${idProyecto} en los proyectos`
            })
        }     
        if (existeProyecto.creador.toString() !== creador.toString()) {
            return res.status(400).json({
                ok: false,
                error: 'No tienen permisos para agregar tareas a este proyecto',
            }) 
        }    
        const tareas = await Tarea.find({idProyecto})   
        return res.json({
            ok: true,
            tareas
        })

    
    },

    editarTarea: async (req, res) => {
        try {
            let creador = req.userData._id

            let idTarea = req.params.id
            let {proyecto, nombre, estado} = req.body


            const existeProyecto = await Proyecto.findById(proyecto)
            if (!existeProyecto) {
                return res.status(400).json({
                    ok: false,
                    error: `No existe el ID: ${proyecto} en los proyectos`
                })
            }     
            if (existeProyecto.creador.toString() !== creador.toString()) {
                return res.status(400).json({
                    ok: false,
                    error: 'No tienen permisos para editar tareas a este proyecto',
                }) 
            }    

            const existeTarea = await Tarea.findById(idTarea)
            if (!existeTarea) {
                return res.status(400).json({
                    ok: false,
                    error: `No existe el ID: ${idTarea} en las tareas`
                })
            }   

            const tarea = {}

            if (nombre) {
                tarea.nombre = nombre
            }
            if (estado) {
                tarea.estado = estado
            }

            tareaUpd = await Tarea.findOneAndUpdate({_id:idTarea}, tarea, {new: true})

            res.json({
                ok: true,
                tareaUpd
            })

            
        } catch (error) {
            console.log(error)
            res.status(500).json({
                ok: false,
                message: 'ocurrio un error'
            })
        }
        
    },
    
    eliminarTarea: async(req, res) => {
        try {
            let creador = req.userData._id
            let idTarea = req.params.id
            let {proyecto} = req.body

            const existeProyecto = await Proyecto.findById(proyecto)
            if (!existeProyecto) {
                return res.status(400).json({
                    ok: false,
                    error: `No existe el ID: ${proyecto} en los proyectos`
                })
            }     
            if (existeProyecto.creador.toString() !== creador.toString()) {
                return res.status(400).json({
                    ok: false,
                    error: 'No tienen permisos para editar tareas a este proyecto',
                }) 
            }    

            const existeTarea = await Tarea.findById(idTarea)
            if (!existeTarea) {
                return res.status(400).json({
                    ok: false,
                    error: `No existe el ID: ${idTarea} en las tareas`
                })
            }   

            await Tarea.findOneAndRemove({_id:idTarea})

            res.json({
                ok: true,
                message: 'tarea borrada'
            })

            
        } catch (error) {
            console.log(error)
            res.status(500).json({
                ok: false,
                message: 'ocurrio un error'
            })
        }
    },


}

module.exports = controller