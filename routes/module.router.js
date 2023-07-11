const express = require('express')
const {getModules,getModuleById, createModule, updateModule, deleteModule } = require('../controllers/module.controller')
const { webProtection } = require('../helper/auth')
const router = express.Router()

router.post('/getmodules/:search?', webProtection, getModules)
router.get('/getmodules/:id',webProtection, getModuleById)
router.post('/createmodule', webProtection, createModule)
router.put('/updatemodule/:id', webProtection, updateModule)
router.delete('/deletemodule/:id', webProtection, deleteModule)


module.exports = router