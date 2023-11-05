const router = require('express').Router()
const UserController = require('../controllers/UserController')

//middleware
const verifyToken = require('../helpers/verify-token')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/checkuser', UserController.checkUser)
router.get('/:id', UserController.getUserById)
//rota protegida pelo TOKEN do usuário! Entre a função e o controller, coloco o meu middleware (verifyToken)!
//1) O middleware é executado primeiro e ele pode realizar verificações relacionadas à autenticação ou autorização com base no token presente na solicitação.
//2) Se o middleware verifyToken não interromper o fluxo da solicitação (por exemplo, respondendo com um erro ou redirecionamento)...
//2) A execução continuará para função UserController.editUser, que será responsável por manipular a solicitação de edição do usuário.
router.patch('/edit/:id', verifyToken, UserController.editUser)


module.exports = router