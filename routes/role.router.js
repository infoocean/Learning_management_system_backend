const express = require('express')
const {getAuthToken} = require('../controllers/role.controller')
const router = express.Router()

router.get('/generatetoken', getAuthToken)

module.exports = router