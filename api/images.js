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