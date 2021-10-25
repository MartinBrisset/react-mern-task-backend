const express = require('express')
const router = express.Router()
const proyectoController = require('../controllers/proyectoController')
const auth = require('../middlewares/auth')

router.post('/', auth.token, proyectoController.crearProyecto)
router.get('/', auth.token, proyectoController.verMisProyectos)
router.put('/:id', auth.token, proyectoController.editarProyecto)
router.delete('/:id', auth.token, proyectoController.eliminarProyecto)


module.exports = router