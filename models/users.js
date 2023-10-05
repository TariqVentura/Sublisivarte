/**
 * Se llama a la dependencia de mongoose
 */
const MONGOOSE = require('mongoose')

/**
 * se crea una variable que fuciona como un modelo de coleccion de mongo
 * Se definen los documentos que almacenara y su tipo
 */
let userSchema = new MONGOOSE.Schema(
    {
        name: {
            type: String,
            require: true
        },
        lastname: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true,
            unique: true
        },
        user: {
            type: String,
            require: true,
            unique: true
        },
        password: {
            type: String,
            require: true
        },
        role: {
            type: ["admin", "cliente"],
            default: 'cliente',
            require: true
        },
        status: {
            type: ["activo", "inactivo", "baneado"],
            require: true,
            default: 'activo'
        },
        document: {
            type: String,
            unique: true,
            require: true
        },
        authentification: {
            type: ["activado", "desactivado"],
            default: "desactivado",
            require: true,
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
const USERS = MONGOOSE.model('users', userSchema)

/**
 * Se exporta para que pueda acceder a el
 */
module.exports = USERS