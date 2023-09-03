const MONGOOSE = require('mongoose')

/**
 * se crea una variable que fuciona como un modelo de coleccion de mongo
 * Se definen los documentos que almacenara y su tipo
 */
let changeSchema = new MONGOOSE.Schema(
    {
        code: {
            type: String,
            require: true
        },
        user: {
            type: String,
            require: true
        },
        date:{
            type: String,
            require: true
        },
        status: {
            type: ["activo", "inactivo"],
            require: true,
            default: "activo"
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
const CHANGES = new MONGOOSE.model('changes', changeSchema)

/**
 * Se exporta para que pueda acceder a el
 */
module.exports = CHANGES