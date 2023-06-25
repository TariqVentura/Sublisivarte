const AXIOS = require('axios')
let session

exports.index = (req, res) => {
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
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/products')
        .then(function (response) {
            AXIOS.get('http://localhost:443/api/categories')
                .then(function (categorie) {
                    res.render('productos', { products: response.data, categories: categorie.data, user: session, mensaje: ". ", confirmation: false, icon: " ." })
                })
                .catch(err => {
                    res.send('hola')
                })
        })
        .catch(err => {
            res.send('No se puedieron cargar los productos')
        })
}

exports.producto = (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    res.render('producto', { user: session })
}

exports.categories = (req, res) => {
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
    if (req.session.user) {
        session = req.session
        AXIOS.get('http://localhost:443/api/orders/' + req.session.user)
            .then(function (order) {
                res.render('carrito', { user: session, orders: order.data })
            })
    } else {
        session = false
        res.render('carrito', { user: session })
    }
}

exports.details = (req, res) => {
    if (req.session.user) {
        session = req.session
        AXIOS.get('http://localhost:443/api/details/' + req.params.id)
            .then(function (detail) {
                res.render('detalles', { user: session, details: detail.data, status: req.params.status, order: req.params.id })
            })
    } else {
        session = false
        res.render('detalles', { user: session })
    }
}

exports.cuenta = (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    res.render('cuenta', { user: session })
}

exports.usuarios = (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/users')
        .then(function (response) {
            res.render('usuarios', { users: response.data, user: session })
        })
        .catch(err => {
            res.send('No se pudieron cargar los usuarios')
        })
}

exports.administracion = (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    res.render('administracion', { user: session })
}