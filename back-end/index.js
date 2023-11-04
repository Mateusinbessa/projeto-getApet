const express = require("express")
const cors = require("cors")
const app = express()

//Config JSON response
app.use(express.json())

//Solve CORS
//credentials: Isso permite que as solicitações CORS incluam credenciais, como cookies ou cabeçalhos de autenticação
//origin: Isso define o site de origem permitido. Neste caso, apenas solicitações originadas do site "http://localhost:3000" serão permitidas
//a acessar recursos em sua aplicação. Isso é útil para proteger sua API contra solicitações não autorizadas de outros domínios.
app.use(cors({credentials: true, origin:'http://localhost:3000'}))

//Pulic folder for images
app.use(express.static('public'))

//Routes

app.listen(5000, () => {console.log('Servirdor rodando na porta 5000')})