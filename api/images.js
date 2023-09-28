const IMAGES = require('../models/images')

exports.saveImages = async (req, res) => {
    // Verifica si no se proporciona una imagen en el cuerpo de la solicitud.
    if (!req.body.image) {
        return res.send('empty') // Responde con 'empty' si no se proporciona una imagen.
    } else {
        // Extrae el nombre del archivo de la ruta proporcionada.
        const NEW_IMAGE = String(req.body.image).substring("C:/fakepath/".length);

        // Verifica si la extensión del archivo es válida (png, jpg o jpeg).
        if (NEW_IMAGE.includes('.png') == false && NEW_IMAGE.includes('.jpg') == false && NEW_IMAGE.includes('.jpeg') == false) {
            return res.send('format') // Responde con 'format' si la extensión no es válida.
        }

        // Crea una nueva instancia del modelo de imágenes con el nombre de la imagen.
        const IMAGE = new IMAGES({
            image: NEW_IMAGE
        })

        // Intenta guardar la imagen en la base de datos.
        const SAVE = await IMAGE.save()

        if (SAVE) {
            return res.send(true) // Si la imagen se guarda correctamente, responde con 'true'.
        } else {
            return res.send(false) // Si la imagen no se guarda correctamente, responde con 'false'.
        }
    }
}

exports.getImages = (req, res) => {
    // Utiliza el método 'find' para buscar todas las imágenes en la base de datos.
    IMAGES.find()
        .then(data => {
            // Verifica si no se encontraron datos en la búsqueda.
            if (!data) {
                res.send('erorr') // Responde con 'erorr' si no se encontraron datos.
            } else {
                res.send(data) // Responde con los datos de las imágenes encontradas.
            }
        })
        .catch(err => {
            res.send('err') // Si ocurre un error durante la búsqueda, responde con 'err'.
        });
}

//Esta línea exporta una función asíncrona llamada "deleteImages" que toma dos parámetros, una solicitud (req) y una respuesta (res).
exports.deleteImages = async (req, res) => {
    //Esta línea declara una constante llamada "ID" que se establece en el parámetro de identificación de la solicitud.
    const ID = req.params.id
    //Esta línea imprime el valor de la constante "ID" en la consola.
    console.log(ID)
    //Esta línea utiliza el método "findByIdAndDelete" para buscar y eliminar una imagen de la base de datos utilizando el ID proporcionado. La función "exec" se utiliza para ejecutar la consulta.
    const DELETE_IMAGE = await IMAGES.findByIdAndDelete(ID).exec()
    //Esta línea imprime el resultado de la consulta en la consola.
    console.log(DELETE_IMAGE)
    //Esta línea comprueba si se ha eliminado una imagen de la base de datos.
    if (DELETE_IMAGE) {
        //Si se ha eliminado una imagen, esta línea devuelve una respuesta "true".
        return res.send(true)
    } else {
        //Si no se ha eliminado una imagen, esta línea devuelve una respuesta "false".
        return res.send(false)
    }
}