const express = require('express')
const router = express.Router()
const usuarioController = require('../controllers/usuarioController')
const auth = require('../middlewares/auth')

router.post('/', usuarioController.crearUsuario)
router.post('/login', usuarioController.login)


module.exports = router