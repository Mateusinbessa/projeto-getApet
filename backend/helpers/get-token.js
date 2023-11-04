const getToken = (req) => {
    //O console.log que a gente deu no token lá no controller, a gente vê que ele vem com o nome Bearer na frente, vamos tratar.
    const authHeader = req.headers.authorization
    //dividindo quando ver um espaço e pegando a segunda parte
    const token = authHeader.split(" ")[1]
    return token
}

module.exports = getToken