/**
 * Se llama a la dependencia de mongoose
 */
const MONGOOSE = require('mongoose')

/**
 * se crea una variable que fuciona como un modelo de coleccion de mongo
 * Se definen los documentos que almacenara y su tipo
 */
let productSchema = new MONGOOSE.Schema({
    product: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    categorie: {
        type: String,
        require: true
    },
    user: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    stock: {
        type: Number
    },
    review: {
        type: Number
    },
    status: {
        type: ['active','inactive','No Stock'],
        require: true
    }
},
    {
        timestamps: true,
        versionKey: false
    }
)