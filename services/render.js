const AXIOS = require('axios')

exports.index = (req, res) => {
    let session
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/images')
        .then(function (images) {
            res.render('index', { user: session, resources: images.data })
        })
}

exports.newAccount = (req, res) => {
    res.render('account', { user: false })
}

exports.products = (req, res) => {
    let session
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/products')
        .then(function (response) {
            AXIOS.get('http://localhost:443/api/categories')
                .then(function (categorie) {
                    res.render('productos', { products: response.data, categories: categorie.data, user: session })
                })
                .catch(err => {
                    res.send('hola')
                })
        })
        .catch(err => {
            res.send('No se puedieron cargar los productos')
        })
}

exports.categories = (req, res) => {
    let session
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/categories')
        .then(function (categorie) {
            res.render('categories', { categorie: categorie.data, user: session })
        })

}

exports.carrito = (req, res) => {
    let session
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    res.render('carrito', { user: session })
}