const router = require('express').Router()
const UserController = require('../controllers/UserController')

//middleware
const verifyToken = require('../helpers/verify-token')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/checkuser', UserController.checkUser)
router.get('/:id', UserController.getUserById)
    //Essa rota dá informações do usuário pelo ID! Mas no lugar de pegar o ID da URL que seria uma falha de segurança, eu tou pegando através do TOKEN!
    //O usuário poderia manipular o id da url e pegar as informações de outro usuário, mas ele não pode mentir sobre o token de autenticação dele (em tese... kkkk)
router.patch('/edit/:id', verifyToken, UserController.editUser)
    //rota protegida pelo TOKEN do usuário! Entre a função e o controller, coloco o meu middleware (verifyToken)!
    //1) O middleware é executado primeiro e ele pode realizar verificações relacionadas à autenticação ou autorização com base no token presente na solicitação.
    //2) Se o middleware verifyToken não interromper o fluxo da solicitação (por exemplo, respondendo com um erro ou redirecionamento)...
    //2) A execução continuará para função UserController.editUser, que será responsável por manipular a solicitação de edição do usuário.
    //SEGURANÇA: NO LUGAR DE PEGAR O USUÁRIO PELO ID DA URL EU PEGO PELO TOKEN, PRA SABER SE ELE RELAMENTE É QUEM DIZ SER!


module.exports = router