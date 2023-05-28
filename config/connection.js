/**
 * Declaramos una constante para acceder a la dependencia de mongoose 
 * que hace la conexion con la base de datos de mongo
 */
const mongoose = require('mongoose')

/**
 * Creamos un metodo con async y await en el que con la dependencia de mongoose
 *  conectaremos la pagina web al servidor web de atlas
 */
const connection = async() => {
    try {
        const con = await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log(`MongoDB connected: ${con.connection.host}`)
    } catch (err) {
        console.log(err)
    }
}

/**
 * se exporta el metodo para que pueda ser accesido por la app
 */
module.exports = connection