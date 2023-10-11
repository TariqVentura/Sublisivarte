const RECORD = require('../models/record')
const AXIOS = require('axios')
const PRODUCTS = require('../models/products')
const FECHA = new Date()

exports.newRecord = (req, res) => {
    //// Verifica si el usuario que realiza la solicitud tiene permisos de administrador
    if (!req.session.user || req.session.role != 'admin' ) {
        res.redirect('/error404')
        return
    }
    // Verifica si los campos necesarios para agregar un nuevo registro están presentes en la solicitud HTTP
    if (!req.body.id || !req.body.stock || !req.body.prevStock || !req.body.product) {
        // Si alguno de los campos está vacío, se realiza una solicitud GET a la API de productos y categorías para cargar los datos necesarios y se muestra un mensaje de error al usuario
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
        // Crea un nuevo registro utilizando los datos proporcionados en la solicitud HTTP
        const NEW_RECORD = new RECORD({
            product: req.body.product,
            stock: req.body.stock,
            date: FECHA.toISOString().substring(0, 10) + ' ' + FECHA.getHours() + ':' + FECHA.getMinutes() + ':' + FECHA.getSeconds()
        })
        //// Actualiza el stock del producto correspondiente en la base de datos
        NEW_RECORD.save(NEW_RECORD).then(data => {
            if (!data) {
                res.send('Ha ocurrido un error')
            } else {
                let sum = Number(req.body.prevStock) + Number(req.body.stock)
                if (sum < 0) {
                    //// Si el stock resultante es menor que cero, se muestra un mensaje de error al usuario
                    res.send('Existencias insuficientes')
                } else {
                    //// Si el stock resultante es mayor que cero, se actualiza el estado del producto en la base de datos y se muestra un mensaje de éxito al usuario
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
                                PRODUCTS.findByIdAndUpdate(req.body.id, { status: 'activo' }, { useFindAndModify: false }).then(status => {
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
    // Busca un registro en la base de datos que tenga un campo "product" igual al valor proporcionado en el parámetro "key" de la solicitud HTTP
    RECORD.find({ product: req.params.key }).then(data => {
        //// Si no se encuentra ningún registro, se envía un mensaje de "producto no encontrado" como respuesta
        if (!data) {
            res.send('producto no encontrado')
        } else {
            // Si se encuentra un registro, se envía como respuesta al cliente
            res.send(data)
        }
    })
}