const express = require('express')
const {webProtection} = require('../helper/auth')
const { createEmailType, getAllEmailType, updateEmailType } = require('../controllers/emailtype.controller')

const router = express.Router()

router.get('/getemailtype/:id?', webProtection, getAllEmailType)
router.post('/createemailtype', webProtection, createEmailType)
router.put('/updateemailtype/:id',webProtection, updateEmailType)

module.exports = router