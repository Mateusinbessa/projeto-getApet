const User = require('../models/User')
const bcrypt = require('bcrypt')

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
            res.status(201).json({message: 'Usuário criado!', newUser})
        } catch (error) {
            res.status(500).json({message: error})
        }
    }
}