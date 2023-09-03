const DETAILS = require('../models/details')
const PRODUCTS = require('../models/products')
const AXIOS = require('axios')
const FECHA = new Date()
const PDF = require('pdf-creator-node')
const PATH = require('path')
const FS = require('fs')
const OPTIONS2 = require('../helpers/format/detail')

exports.createDetail = (req, res) => {
    if (!req.body.product || !req.body.amount || !req.body.price || !req.body.order) {
        AXIOS.get('http://localhost:443/api/products')
            .then(function (response) {
                AXIOS.get('http://localhost:443/api/categories')
                    .then(function (categorie) {
                        res.render('productos', { products: response.data, categories: categorie.data, user: session, mensaje: "No se permiten campos vacios", confirmation: true, icon: "success" })
                    })
                    .catch(err => {
                        res.send('hola')
                    })
            })
            .catch(err => {
                res.send('No se puedieron cargar los productos')
            })
    } else {
        let orderDetail = { "color": req.body.color, "talla": req.body.size, "image": req.body.image }

        let total = Number(req.body.price) * Number(req.body.amount)

        let math = Number(req.body.stock) - Number(req.body.amount)

        const DETAIL = new DETAILS({
            product: req.body.product,
            price: req.body.price,
            amount: req.body.amount,
            total: total.toFixed(2),
            order: req.body.order,
            description: JSON.stringify(orderDetail)
        })

        if (math > 0) {
            DETAIL.save(DETAIL).then(data => {
                if (!data) {
                    res.status(404).send('error')
                } else {
                    let id, value
                    id = req.body.id
                    value = { stock: math }
                    PRODUCTS.findByIdAndUpdate(id, value, { useFindAndModify: false })
                        .then(product => {
                            if (!product) {
                                res.status(404).send('no se permiten campos vacios')
                            } else {
                                res.redirect('/carrito')
                            }
                        })
                }
            })
        } else if (math == 0) {
            DETAIL.save(DETAIL).then(data => {
                if (!data) {
                    res.status(404).send('error')
                } else {
                    let id, value
                    id = req.body.id
                    value = { stock: math, status: 'No Stock' }
                    PRODUCTS.findByIdAndUpdate(id, value, { useFindAndModify: false })
                        .then(product => {
                            if (!product) {
                                res.status(404).send('no se permiten campos vacios')
                            } else {
                                res.redirect('/carrito')
                            }
                        })
                }
            })
        } else {
            res.send('Stock insuficiente')
        }




    }
}

exports.cancelDetail = (req, res) => {
    const key = req.params.key
    const stock = req.params.stock
    const ID = req.params.id

    DETAILS.findByIdAndDelete(ID, req.body, { useFindAndModify: true })
        .then(data => {
            if (!data) {
                res.status(404).send('error')
            } else {
                PRODUCTS.findOne({ product: key })
                    .then(data => {
                        if (!data) {
                            res.status(404).send('no datos')
                        } else {
                            let value = { stock: Number(data.stock) + Number(stock) }
                            PRODUCTS.findByIdAndUpdate(data.id, value, { useFindAndModify: false })
                                .then(result => {
                                    if (!result) {
                                        res.send('error')
                                    } else {
                                        res.send('OK')
                                    }
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
        })
}

exports.getDetails = (req, res) => {
    const ID = req.params.id

    DETAILS.find({ $or: [{ order: { $regex: ID } }] })
        .then(data => {
            if (!data) {
                res.send('error')
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            res.send(err)
        })
}

exports.getReportDetail = (req, res) => {
    const HMTL = FS.readFileSync(PATH.join(__dirname, '../helpers/templates/detail.html'), 'utf-8')
    const FILE_NAME = 'REPORTE_DE_PRODUCTOS_' + req.params.key + '.pdf'
    AXIOS.get('http://localhost:443/api/details/' + req.params.key).then(function (detail) {
        let obj = detail.data
        let newDate = FECHA.toISOString().substring(0, 10) + ' ' + FECHA.getHours() + ':' + FECHA.getMinutes() + ':' + FECHA.getSeconds()

        const DATA = {
            user: req.session.user,
            obj: obj,
            newDate: newDate,
            client: req.params.client
        }

        const DOCUMENT = {
            html: HMTL,
            data: {
                data: DATA
            },
            path: "./docs/" + FILE_NAME,
            type: ""
        }

        PDF.create(DOCUMENT, OPTIONS2).then(p => {
            //redirecciona al documento creato
            res.redirect('/' + FILE_NAME)
        }).catch(err => {
            res.send(err)
        })
    })
}