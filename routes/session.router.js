const express = require('express')
const {getSessions,getSessionById,createSession,updateSession, deleteSession} = require('../controllers/session.controller')
const{webProtection} = require('../helper/auth')
const router = express.Router()
const {upload} = require('../helper/upload')

router.post("/getsession/:search?", webProtection, getSessions)
router.get("/getsession/:id",webProtection, getSessionById)
router.post("/createsession", webProtection , upload.single("attachment"), createSession)
router.put("/updatesession/:id", webProtection, upload.single("attachment"), updateSession )
router.delete("/deletesession/:id", webProtection, deleteSession )


module.exports = router
