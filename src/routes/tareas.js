const express = require('express')
const router = express.Router()
const tareaController = require('../controllers/tareasController')
const auth = require('../middlewares/auth')

router.post('/', auth.token, tareaController.crearTarea)
router.get('/:id', auth.token, tareaController.verMisTareasDeUnProyecto)
router.put('/:id', auth.token, tareaController.editarTarea)
router.delete('/:id', auth.token, tareaController.eliminarTarea)


module.exports = router