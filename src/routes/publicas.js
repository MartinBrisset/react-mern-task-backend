const express = require('express')
const router = express.Router()
const publicController = require('../controllers/publicControler')


router.get('/', publicController.inicio)

module.exports = router