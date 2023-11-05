const jwt = require('jsonwebtoken')
const getToken = require('./get-token')

//middleware to validate token
const checkToken = (req, res, next) => {

    //se não vier nada na autorization
    if(!req.headers.authorization) {
        return res.status(401).json({message: "Acesso negado!"})
    }

    const token = getToken(req)

    //se não vier token!
    if(!token) {
        return res.status(401).json({message: "Acesso negado!"})
    }

    try {
        const verified = jwt.verify(token, "nossoSecret")
        req.user = verified
        next()
    } catch (error) {
        return res.status(401).json({message: "Token Inválido!"})
    }
}

module.exports = checkToken