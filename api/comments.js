const COMMENTS = require('../models/comments')
const AXIOS = require('axios')

exports.createComment = async (req, res) => {
    //La función comienza con una validación de si los campos de comentario, revisión, producto y cliente están vacíos. Si alguno de estos campos está vacío, se devuelve un mensaje de error "empty" y se detiene la ejecución de la función.
    if (!req.body.comment || !req.body.review || !req.body.product || !req.body.client) {
        return res.send('empty')
    } else {
        //Si todos los campos están llenos, se declaran variables para almacenar los datos de la solicitud HTTP.
        let comment, review, product, client

        //obtener datos de la peticion
        comment = req.body.comment
        review = Number(req.body.review)
        product = req.body.product
        client = req.body.client

        //Se verifica la longitud del comentario y si es mayor a 250 caracteres, se devuelve un mensaje de error "length" y se detiene la ejecución de la función.
        if (comment.length > 250) {
            return res.send('length')
        }

        //Se valida que la revisión esté dentro del rango de 0 a 10. Si la revisión está fuera de este rango, se devuelve un mensaje de error "max" y se detiene la ejecución de la función.
        if (review > 10 || review < 0) {
            return res.send('max')
        }

        //Se valida que los campos de comentario, producto y cliente no estén vacíos después de eliminar los espacios en blanco. Si alguno de estos campos está vacío, se devuelve un mensaje de error "empty" y se detiene la ejecución de la función.
        if (!comment.trim() || !product.trim() || !client.trim()) {
            return res.send('empty')
        }

        //Se crea un objeto "COMMENT" que contiene los datos de la solicitud HTTP.
        const COMMENT = new COMMENTS({
            comment: comment,
            review: review,
            product: product,
            client: client

        })

        //Se utiliza el método "save" del modelo "COMMENTS" para guardar el objeto "COMMENT" en la base de datos. El resultado se almacena en la variable "SAVE".
        const SAVE = await COMMENT.save()

        //Si se guarda correctamente el objeto "COMMENT", se devuelve un valor booleano "true". De lo contrario, se devuelve un valor booleano "false".
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
    // Comprueba si se proporcionó un parámetro 'id' en la solicitud.
    if (req.params.id) {
        // Obtiene el valor del parámetro 'id' desde la consulta de la URL.
        const ID = req.query.id 
        // Realiza una búsqueda en una base de datos (posiblemente utilizando un modelo llamado COMMENTS) utilizando el 'ID' proporcionado.
        COMMENTS.findById(ID)
            .then(data => {
                // Comprueba si no se encontraron datos en la búsqueda.
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