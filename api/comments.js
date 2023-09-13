const COMMENTS = require('../models/comments')
const AXIOS = require('axios')

exports.createComment = async (req, res) => {
    if (!req.body.comment || !req.body.review || !req.body.product || !req.body.client) {
        return res.send('empty')
    } else {
        let comment, review, product, client

        comment = req.body.comment
        review = req.body.review
        product = req.body.product
        client = req.body.client

        if (!comment.trim() || !review.trim() || !product.trim() || !client.trim()) {
            return res.send('empty')
        }

        const COMMENT = new COMMENTS({
            comment: req.body.comment,
            review: Number(req.body.review),
            product: req.body.product,
            client: req.body.client

        })

        const SAVE = await COMMENT.save()

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
        const id = req.query.id
        COMMENTS.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "No se pudo encontrar este usuario" })
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Ocurrio un error al intentar ejecutar el proceso" })
            })
    } else {
        COMMENTS.find()
            .then(user => {
                res.send(user)
                console.log(user)
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Ocurrio un error al tratar de obtener la informacion" })
            })
    }
}

exports.deleteComments = (req, res) => {
    if (!req.session.user) {
        res.redirect('/error404')
        return
    }
    const id = req.params.id
    COMMENTS.findByIdAndDelete(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: 'Producto no encontrado' })
            } else {
                AXIOS.get('http://localhost:443/api/comments')
                    .then(function (response) {
                        AXIOS.get('http://localhost:443/api/products')
                            .then(function (productos) {
                                res.render('comentarios', { comments: response.data, products: productos.data, user: req.session, mensaje: "Comentario Eliminado", confirmation: true, icon: 'success' })
                            })
                            .catch(err => {
                                res.send(err)
                            })
                    })
                    .catch(err => {
                        res.send(err)
                    })
            }
        })
        .catch(err => {
            res.send(err)
        })
}

exports.serchComments = (req, res) => {
    const key = req.params.key
    COMMENTS.find(
        {
            "$or": [
                { comment: { $regex: key } },
                { product: { $regex: key } }
            ]
        }
    )
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Sin datos` })
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            res.send(err)
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
    COMMENTS.aggregate().match({ product : req.params.key }).group({
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