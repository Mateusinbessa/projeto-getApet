const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')

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
    
    //Helper pra pegar o usuário que tá utilizando o sistema, através do token!
    static async checkUser(req, res) {
        //variável que muda de valor
        let currentUser;

        //se o correntUser existe ou nao!
        if(req.headers.authorization) {
        //VOU CHAMAR UM HELPER PRA DECODIFICAR O TOKEN, ENCONTRAR O USUARIO PELO ID QUE TA INSERIDO NO TOKEN E RETORNAR PARA O FRONT!
            //resgatando o token
            const token = getToken(req)
            //decodificando ele, o verify me retorna um objeto com todas as propriedades que eu enviei no token!
            const decoded = jwt.verify(token, 'nossoSecret')
            //pegando o id que tá lá em decoded e dando uma busca no usuário!
            currentUser = await User.findById(decoded.id)
            //removendo a senha do usuário antes de enviá-lo de volta pro front-end! (SEGURANÇA!)
            currentUser.password = undefined
        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id

        try {
            //selecionando tudo de usuários, menos a senha!
            const user = await User.findById(id).select('-password')

            if(!user){
                res.status(404).json({message: 'Usuário não encontrado!'})
            }

            res.status(200).json({user})
        } catch (error) { 
            console.error(error)
            res.status(500).json({message: 'Erro interno do servidor!'})
        }
    }
}