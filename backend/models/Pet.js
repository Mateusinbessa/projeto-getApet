const mongoose = require('../db/conn')
const { Schema } = mongoose

const Pet = mongoose.model(
    'Pet',
    new Schema({
        name: {type: String, required: true},
        age: {type: Number, required: true},
        weight: {type: Number, required: true},
        color: {type: String, required: true},
        images: {type: Array, required: true},
        available: {type: Boolean, required: true},
        //objeto do tipo usuario e adotante
        user: Object,
        adopter: Object
        //timestamps --> criar duas colunas novos que vai marcar a data de quando o dado foi criado e quando foi atualizado
    }, {timestamps: true})
)

module.exports = Pet