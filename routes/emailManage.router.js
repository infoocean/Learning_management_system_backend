const express = require('express')
const {webProtection} = require('../helper/auth')
const { createEmailContent, updateEmailContent, getAllEmailContent } = require('../controllers/emailmanage.controller')
const router = express.Router()

router.get('/getemailmanage/:id?', webProtection, getAllEmailContent)
router.post('/createemailmanage', webProtection, createEmailContent)
router.put('/updateemailmanage/:id',webProtection, updateEmailContent)

module.exports = router