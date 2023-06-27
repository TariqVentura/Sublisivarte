/**
 * Se llama a la dependencia de mongoose
 */
const MONGOOSE = require('mongoose')

/**
 * se crea una variable que fuciona como un modelo de coleccion de mongo
 * Se definen los documentos que almacenara y su tipo
 */
let commentsSchena = new MONGOOSE.Schema(
    {
        comment: {
            type: String,
            require: true
        },
        review: {
            type: Number,
            require: true
        },
        product: {
            type: String,
            require: true
        },
        client: {
            type: String,
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
const COMMENTS = new MONGOOSE.model('comments', commentsSchena)

/**
 * Se exporta para que pueda acceder a el
 */
module.exports = COMMENTS