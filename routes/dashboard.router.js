const express = require('express')
const {webProtection} = require('../helper/auth')
const { getDashboard } = require('../controllers/admindashboard.controller')

const router = express.Router()

router.get('/getdashboard', webProtection, getDashboard)

module.exports = router