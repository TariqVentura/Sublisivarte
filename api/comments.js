const COMMENTS = require('../models/comments')
const AXIOS = require('axios')

exports.createComment = (req, res) => {
    if (!req.body.comment || !req.body.review || !req.body.product || !req.body.client) {
        res.send('no se permiten campos vacios')
    } else {
        const COMMENT = new COMMENTS({
            comment: req.body.comment,
            review: Number(req.body.review),
            product: req.body.product,
            client: req.body.client

        })
        COMMENT
            .save(COMMENT)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: `Ocurrio un error al intentar subir los datos` })
                } else {
                    AXIOS.get('http://localhost:443/api/comments')
                        .then(function (response) {
                            AXIOS.get('http://localhost:443/api/products')
                                .then(function (productos) {
                                    res.render('comentarios', { comments: response.data, products: productos.data, mensaje: "Comentario Creado", confirmation: true, icon: 'success', user: req.session })
                                })
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
    const id = req.params.id
    COMMENTS.findByIdAndDelete(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: 'Producto no encontrado' })
            } else {
                res.send('Comentario Eliminado')
            }
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

exports.commentStatus = (req, res) => {
    const STATUS = req.params.status
    const ID = req.params.id
    const VALUE = { status: STATUS }
    COMMENTS.findByIdAndUpdate(ID, VALUE, { useFindAndModify: false })
        .then

}