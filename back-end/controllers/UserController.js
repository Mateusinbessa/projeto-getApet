const User = require('../models/User')
const bcrypt = require('bcrypt')
const createUserToken = require('../helpers/create-user-token')

module.exports = class UserController {
    static async register(req, res) {
        const {name, email, phone, password, confirmpassword} = req.body

        // validations --> o front também consegue fazer, a gente só tá deixando a prova de bala aqui! reforço duplo!!!
        if(!name) {
            res.status(422).json({message: 'O nome é obrigatório'})
            return
        }

        if(!email) {
            res.status(422).json({message: 'O email é obrigatório'})
            return
        }

        if(!phone) {
            res.status(422).json({message: 'O telefone é obrigatório'})
            return
        }

        if(!password) {
            res.status(422).json({message: 'A senha é obrigatória'})
            return
        }

        if(!confirmpassword) {
            res.status(422).json({message: 'A confirmação de senha é obrigatório'})
            return
        }

        // check equals passwords
        if(password !== confirmpassword) {
            res.status(422).json({message: 'A senha e a confirmação de senha precisam ser iguais.'})
            return
        }
        
        //check if user exists
        const userExists = await User.findOne({email: email})

        if(userExists) {
            res.status(422).json({message: 'Email já cadastrado!'})
            return
        }
        
        //create a password --> preciso criptografar essa paradinha antes de subir no banco!
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //create a user
        //Quando o nome da variável é igual o valor da chave, eu posso passar apenas 1 deles. Veja a diferença do password pro resto!
        const user = new User({name, email, phone, password: passwordHash})

        try {
            const newUser = await user.save()
            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({message: error})
        }
    }

    static async login(req, res) {
        const {email, password} = req.body

        if(!email) {
            res.status(422).json({message: 'O email é obrigatório'})
            return
        }

        if(!password) {
            res.status(422).json({message: 'A senha é obrigatória'})
            return
        }

        //Checando se o email é um email cadastrado
        const user = await User.findOne({email: email})

        if(!user) {
            res.status(422).json({message: 'Não há usuário cadastrado com este email!'})
            return
        }

        //check if password match with db passoword
        //se o email for cadastrado ele não entra no if, e entra aqui, pegando a senha do usuário criptografada e comparando!
        const checkPassword = await bcrypt.compare(password, user.password)

        //Se "checkPassword" me retornar false, vai entrar aqui!
        if(!checkPassword) {
            res.status(422).json({message: 'Senha inválida!'})
            return
        }

        await createUserToken(user, req, res)
    }
    
}