const jsonwebtoken = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

exports.generateToken = async (payload) => {
    const jwt = jsonwebtoken.sign(payload, process.env.SIGNING_KEY)
    return jwt;
}

exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

exports.isValidPassword = async (submittedPassword, storedPassword) => {
    try {
        return await bcrypt.compare(submittedPassword, storedPassword) || false
    }
    catch (e) {
        throw new Error(e)
    }
}

exports.webProtection = async (req, res, next) => {
   
    try{
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1]
            const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY)
            next()
        }
          else {
            res.status(400).send({
                message: 'please provide auth token'
            })
        }
    } catch (e){
        res.status(400).json(e.message)
    }
   
}