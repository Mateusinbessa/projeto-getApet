// criando na pasta helpers porque eu vou usa ela mais de uma vez na minha API!
const jwt = require('jsonwebtoken')

//parameter user --> função recebendo um usuário!
const createUserToken = async(user, req, res) => {
    //criando o token
    //no 2 parâmetro onde eu coloquei "nossoSecret" --> temos que botar STRINGS complexas, essa é uma forma de deixar nosso token unico!
    //({}) --> dentro eu tenho metadado que podem estar inseridos, geralmente o id!
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, "nossoSecret")

    //return token
    res.status(200).json({message: 'Você está autenticado!', token: token, userId: user._id})
}

module.exports = createUserToken