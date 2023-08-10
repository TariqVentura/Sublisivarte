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
    categorie: {
        type: String,
        require: true
    },
    image: {
        type: Array,
        require: true
    },
    stock: {
        type: Number
    },
    status: {
        type: ['active', 'inactive', 'No Stock'],
        default: 'acive',
        require: true
    }
},
    {
        timestamps: true,
        versionKey: false
    }
)

const PRODUCTS = new MONGOOSE.model('poducts', productSchema)

module.exports = PRODUCTS