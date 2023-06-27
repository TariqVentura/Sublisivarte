const COMMENTS = require('../models/comments')
const AXIOS = require('axios')

exports.createComment = (req, res) => {
    if (!req.body.user || !req.body.comment || !req.body.review || !req.body.product) {
        res.send('no se permiten campos vacios')
    } else {
        const COMMENT = new COMMENTS({
            comment: req.body.comment,
            review: Number(req.body.review),
            client: req.body.user,
            product: req.body.product
        })

        COMMENT
            .save(COMMENT)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: `Ocurrio un error al intentar subir los datos` })
                } else {
                    AXIOS.get('http://localhost:433/api/brands')
                        .then(function (response) {
                            AXIOS.get('http://localhost:433/api/categories')
                                .then(function (categories) {
                                    AXIOS.get('http://localhost:433/api/products')
                                        .then(function (product) {
                                            res.render('index', { branches: response.data, categories: categories.data, products: product.data, mensaje: "Comentario creado exitosamente", confirmation: true, icon: "success", user: req.body.user })
                                        })

                                })

                        })
                        .catch(err => {
                            res.send(err)
                        })
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Ocurrio un error al intentar ingresar el comentario"
                })
            })
    }
}

/**  
 * obtenemos el parametro de la URL (key) y lo utilizamos para hacer una 
 * busqueda en la collecion donde se busca una coincidencia entre los 
 * datos que tienen los campos que se especifica y el parametro que se envia
*/
exports.findComments = (req, res) => {
    const key = req.params.key
    COMMENTS.find(
        {
            "$or": [
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