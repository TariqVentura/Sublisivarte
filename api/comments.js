const COMMENTS = require('../models/comments')
const AXIOS = require('axios')

exports.createComment = async (req, res) => {
    //validacion de datos vacios
    if (!req.body.comment || !req.body.review || !req.body.product || !req.body.client) {
        return res.send('empty')
    } else {
        //declaracion de variables
        let comment, review, product, client

        //obtener datos de la peticion
        comment = req.body.comment
        review = Number(req.body.review)
        product = req.body.product
        client = req.body.client

        //manejar longitud del comentario
        if (comment.length > 250) {
            return res.send('length')
        }

        //validar la puntuacion minima y maxima
        if (review > 10 || review < 0) {
            return res.send('max')
        }

        //validar campos vacios
        if (!comment.trim() || !product.trim() || !client.trim()) {
            return res.send('empty')
        }

        //creamos objeto con datos de la peticion
        const COMMENT = new COMMENTS({
            comment: comment,
            review: review,
            product: product,
            client: client

        })

        //guardamos el documento
        const SAVE = await COMMENT.save()

        //validamos que el documento se guarde
        if (SAVE) {
            return res.send(true)
        } else {
            return res.send(false)
        }
    }
}

/**  
 * obtenemos el parametro de la URL (key) y lo utilizamos para hacer una 
 * busqueda en la collecion donde se busca una coincidencia entre los 
 * datos que tienen los campos que se especifica y el parametro que se envia
*/
exports.findComments = (req, res) => {
    if (req.params.id) {
        const ID = req.query.id // Obtiene el valor del parámetro 'id' desde la consulta de la URL.

        COMMENTS.findById(ID)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "No se pudo encontrar este usuario" }) // Si no se encontraron datos, responde con un código de estado 404 y un mensaje de error.
                } else {
                    res.send(data) // Si se encontraron datos, responde con los datos encontrados.
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Ocurrió un error al intentar ejecutar el proceso" }) // Si ocurre un error durante la búsqueda, responde con un código de estado 500 y un mensaje de error genérico.
            })
    } else {
        COMMENTS.find()
            .then(user => {
                res.send(user) // Responde con los datos de todos los comentarios encontrados.
                console.log(user)
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Ocurrió un error al tratar de obtener la información" }) // Si ocurre un error durante la búsqueda, responde con un código de estado 500 y un mensaje de error detallado.
            })
    }
}

//funcion para eliminar comentarios
exports.deleteComments = async (req, res) => {
    //obtenemos el id del producto desde la URL
    if (!req.params.id) {
        return res.send('empty')
    }

    //guardamos el id en una varibale
    let id = req.params.id

    //eliminamos el comentario
    const DELETE = await COMMENTS.findByIdAndDelete(id, req.body, { useFindAndModify: false }).exec()

    //validamos que se haya completado el proceso
    if (!DELETE) {
        return res.send(false)
    } else {
        return res.send(true)
    }
}
exports.searchComments = (req, res) => {
    const KEY = req.params.key // Obtiene el valor del parámetro 'key' de la solicitud.

    COMMENTS.find({
        "$or": [
            { comment: { $regex: KEY } }, // Realiza una búsqueda de texto parcial en el campo 'comment' con la palabra clave 'KEY'.
            { product: { $regex: KEY } } // Realiza una búsqueda de texto parcial en el campo 'product' con la palabra clave 'KEY'.
        ]
    }).then(data => {
        if (!data) {
            res.status(404).send({ message: `Sin datos` }) // Si no se encontraron datos, responde con un código de estado 404 y un mensaje de error.
        } else {
            res.send(data) // Si se encontraron datos, responde con los datos encontrados.
        }
    }).catch(err => {
        res.send(err) // Si ocurre un error durante la búsqueda, responde con el objeto de error.
    })
}


// exports.commentStatus = (req, res) => {
//     const STATUS = req.params.status
//     const ID = req.params.id
//     const VALUE = { status: STATUS }
//     COMMENTS.findByIdAndUpdate(ID, VALUE, { useFindAndModify: false })
//         .then

// }

exports.countCommentsProduct = (req, res) => {
    //Hacemos uso de una funcion de agregacion y obtenemos las ordenes de la tienda
    //Utilizamos match para filtrar los pedidos de un solo cliente
    COMMENTS.aggregate().match({ product: req.params.key }).group({
        //Agrupamos las ordenes por estado y contamos cuantos ordene tiene cada estado
        _id: "$status",
        count: { $count: {} }
    }).then(data => {
        //Enviamos la informacion requerida
        res.send(data)
    }).catch(err => {
        res.status(404).send(err)
    })
}