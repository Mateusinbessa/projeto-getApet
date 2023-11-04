const mongoose = require('../db/conn')
const { Schema } = mongoose

const User = mongoose.model(
    'User',
    new Schema({
        name: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        image: {type: String},
        phone: {type: String, required: true}
        //timestamps --> criar duas colunas novos que vai marcar a data de quando o dado foi criado e quando foi atualizado
    }, {timestamps: true})
)

module.exports = User