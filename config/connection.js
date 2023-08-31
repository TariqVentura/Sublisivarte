/**
 * Declaramos una constante para acceder a la dependencia de mongoose 
 * que hace la conexion con la base de datos de mongo
 */
const MONGOOSE = require('mongoose')

/**
 * Creamos un metodo con async y await en el que con la dependencia de mongoose
 *  conectaremos la pagina web al servidor web de atlas
 */
const CONNECTION = async() => {
    try {
        const CON = await MONGOOSE.connect(process.env.DB_URI, {
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log(`MongoDB connected: ${CON.connection.host}`)
    } catch (err) {
        console.log(err)
    }
}

/**
 * se exporta el metodo para que pueda ser accesido por la app
 */
module.exports = CONNECTION