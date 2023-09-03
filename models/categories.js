const MONGOOSE = require('mongoose')

/**
 * se crea una variable que fuciona como un modelo de coleccion de mongo
 * Se definen los documentos que almacenara y su tipo
 */
let categoriesSchema = new MONGOOSE.Schema(
    {
        categorie: {
            type: String,
            require: true,
            unique: true
        },
        status: {
            type: ["active", "inactive"],
            require: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

/**
 * se crea un objeto de tipo modelo de mongo con el que se creara la coleccion dentro del servidor de atlas
 */
const CATEGORIES = new MONGOOSE.model('categories', categoriesSchema)

/**
 * Se exporta para que pueda acceder a el
 */
module.exports = CATEGORIES