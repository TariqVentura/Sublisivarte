/**
 * Se declaran las constantes para mandar a llamar al controlador y las dependencias de node
 */
const PRODUCTS = require('../models/products')
const AXIOS = require('axios')

/**
 * Por medio de la depencia de axios se obtiene la informacion de las API utilizando el metodo GET y se renderizan las paginas con la informacion obetnida
 * Haciendo uso ddel metodo SAVE de mongoose se guardan los datos en el servidor de Atlas
 */
exports.createProduct = (req, res) => {
    if (!req.body.product || !req.body.price || !req.body.categorie || !req.body.image || !req.body.stock) {
        res.status(404).send('no se permiten campos vacios')
    } else {
        const PRODUCT = new PRODUCTS({
            product: req.body.product,
            price: req.body.price,
            categorie: req.body.categorie,
            image: req.body.image,
            stock: req.body.stock,
            status: 'active'
        })
        PRODUCT
            .save(PRODUCT)
            .then(data => {
                if (!data) {
                    res.status(404).send('Ocurrio un error al crear el Producto')
                } else {
                    AXIOS.get('http://localhost:443/api/products')
                        .then(function (response) {
                            AXIOS.get('http://localhost:443/api/categories')
                                .then(function (categorie) {
                                    res.render('productos', { products: response.data, categories: categorie.data, mensaje: "Producto Ingresado", confirmation: true, icon: 'success', user: req.session })
                                })
                        })
                }
            })
            .catch(err => {
                res.send(err)
            })
    }
}

exports.findProduct = (req, res) => {
    if (req.params.id) {
        const id = req.params.id
        PRODUCTS.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "No se pudo encontrar este producto" })
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Ocurrio un error al intentar ejecutar el proceso" })
            })
    } else {
        PRODUCTS.find()
            .then(product => {
                res.send(product)
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Ocurrio un error al tratar de obtener la informacion" })
            })
    }
}

exports.updateProduct = (req, res) => {
    const id = req.body.id
    PRODUCTS.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "No se encontro el producto" })
            } else {
                AXIOS.get('http://localhost:443/api/products')
                    .then(function (response) {
                        AXIOS.get('http://localhost:443/api/categories')
                            .then(function (categorie) {
                                res.render('productos', { products: response.data, categories: categorie.data, mensaje: "Producto Actualizado", confirmation: true, icon: 'success', user: req.session })
                            })
                    })
            }
        })
}

exports.deleteProducts = (req, res) => {
    const id = req.params.id
    PRODUCTS.findByIdAndDelete(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: 'Producto no encontrado' })
            } else {
                AXIOS.get('http://localhost:443/api/products')
                    .then(function (response) {
                        AXIOS.get('http://localhost:443/api/categories')
                            .then(function (categorie) {
                                res.render('productos', { products: response.data, categories: categorie.data, mensaje: "Producto Eliminado", confirmation: true, icon: 'success', user: req.session })
                            })
                    })
            }
        })
}

exports.searchProduct = (req, res) => {
    const KEY = req.params.key
    PRODUCTS.find(
        {
            "$or": [
                { product: { $regex: KEY } },
                { categorie: { $regex: KEY } },
                { status: { $regex: KEY } }
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

exports.categorieProduct = (req, res) => {
    const KEY = req.params.key
    PRODUCTS.find(
        {
            "$or": [
                { categorie: { $regex: KEY } }
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