const RECORD = require('../models/record')
const AXIOS = require('axios')
const PRODUCTS = require('../models/products')
const FECHA = new Date()
const VALIDATION = require('../helpers/validations/reports')

exports.newRecord = (req, res) => {
    if (!req.session.user || req.session.role != 'admin' ) {
        res.redirect('/error404')
        return
    }
    if (!req.body.id || !req.body.stock || !req.body.prevStock || !req.body.product) {
        AXIOS.get('http://localhost:443/api/products')
            .then(function (response) {
                AXIOS.get('http://localhost:443/api/categories')
                    .then(function (categorie) {
                        res.render('productos', { products: response.data, categories: categorie.data, user: req.session, mensaje: "No se permiten campos vacios", confirmation: true, icon: "error", count: 1 })
                    })
                    .catch(err => {
                        res.send('hola')
                    })
            })
            .catch(err => {
                res.send('No se puedieron cargar los productos')
            })
    } else {
        const NEW_RECORD = new RECORD({
            product: req.body.product,
            stock: req.body.stock,
            date: FECHA.toISOString().substring(0, 10) + ' ' + FECHA.getHours() + ':' + FECHA.getMinutes() + ':' + FECHA.getSeconds()
        })

        NEW_RECORD.save(NEW_RECORD).then(data => {
            if (!data) {
                res.send('Ha ocurrido un error')
            } else {
                let sum = Number(req.body.prevStock) + Number(req.body.stock)
                if (sum < 0) {
                    res.send('Existencias insuficientes')
                } else {
                    let value = { stock: sum }
                    PRODUCTS.findByIdAndUpdate(req.body.id, value, { useFindAndModify: false }).then(product => {
                        if (!product) {
                            res.send('ocurrio un error al actualizar')
                        } else {
                            if (sum === 0) {
                                PRODUCTS.findByIdAndUpdate(req.body.id, { status: 'No Stock' }, { useFindAndModify: false }).then(status => {
                                    if (product) {
                                        AXIOS.get('http://localhost:443/api/products')
                                            .then(function (response) {
                                                AXIOS.get('http://localhost:443/api/categories')
                                                    .then(function (categorie) {
                                                        res.render('productos', { products: response.data, categories: categorie.data, user: req.session, mensaje: "Se ha actualizado el stock", confirmation: true, icon: "success", count: 1 })
                                                    })
                                                    .catch(err => {
                                                        res.send('hola')
                                                    })
                                            })
                                            .catch(err => {
                                                res.send('No se puedieron cargar los productos')
                                            })
                                    } else {
                                        res.send('err')
                                    }
                                })
                            } else if (sum > 0) {
                                PRODUCTS.findByIdAndUpdate(req.body.id, { status: 'active' }, { useFindAndModify: false }).then(status => {
                                    if (product) {
                                        AXIOS.get('http://localhost:443/api/products')
                                            .then(function (response) {
                                                AXIOS.get('http://localhost:443/api/categories')
                                                    .then(function (categorie) {
                                                        res.render('productos', { products: response.data, categories: categorie.data, user: req.session, mensaje: "Se ha actualizado el stock", confirmation: true, icon: "success", count: 1 })
                                                    })
                                                    .catch(err => {
                                                        res.send('hola')
                                                    })
                                            })
                                            .catch(err => {
                                                res.send('No se puedieron cargar los productos')
                                            })
                                    } else {
                                        res.send('err')
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
    }
}

exports.getRecord = (req, res) => {
    RECORD.find({ product: req.params.key }).then(data => {
        if (!data) {
            res.send('producto no encontrado')
        } else {
            res.send(data)
        }
    })
}