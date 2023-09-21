/**
 * Se llama a la dependencia de mongoose
 */
const MONGOOSE = require('mongoose')

/**
 * Se crea una variable que funciona como un modelo de conexión de mongo
 * Se definen los elementos que almacenara y su tipo
 */
let attempsSchema = new MONGOOSE.Schema(
    {
        attempt: {
            type: Number,
            require: true
        },
        user: {
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
 * Se crea un objeto de tipo modelo de mongo con el que se creará la colección dentro del servidor de atlas
 */
const ATTEMPS = new MONGOOSE.model('attemps', attempsSchema)

/**
 * Se exporta para que pueda acceder a el
 */
module.exports = ATTEMPS