const DETAILS = require('../models/details')
const PRODUCTS = require('../models/products')
const AXIOS = require('axios')
const FECHA = new Date()
const PDF = require('pdf-creator-node')
const PATH = require('path')
const FS = require('fs')
const OPTIONS2 = require('../helpers/format/detail')
const VALIDATION = require('../helpers/validations/reports')

exports.createDetail = async (req, res) => {
    if (!req.body.product || !req.body.amount || !req.body.price || !req.body.order) {
        res.sedn('empty')
        return
    } else {
        let product, price, amount, order

        product = req.body.product
        price = req.body.price
        amount = req.body.amount
        order = req.body.order

        console.log(product + price + amount + order)

        if (!product.trim() || !price.trim() || !amount.trim() || !order.trim()) {
            res.send('empty')
            return
        }

        let orderDetail = { "color": req.body.color, "talla": req.body.size, "image": req.body.image }

        let total = Number(req.body.price) * Number(req.body.amount)

        let math = Number(req.body.stock) - Number(req.body.amount)

        const DETAIL = new DETAILS({
            product: product,
            price: price,
            amount: amount,
            total: total.toFixed(2),
            order: order,
            description: JSON.stringify(orderDetail)
        })

        if (math > 0) {

            const SAVE = await DETAIL.save()

            if (!SAVE) {
                res.send(false)
            } else {
                let id, value
                id = req.body.id
                value = { stock: math }

                const STOCK = await PRODUCTS.findByIdAndUpdate(id, value, { useFindAndModify: false }).exec()

                console.log(STOCK)

                if (!STOCK) {
                    res.send(false)
                } else {
                    res.send(true)
                }
            }
        } else if (math == 0) {
            const SAVE = await DETAIL.save()

            console.log(SAVE)

            if (!SAVE) {
                res.send(false)
            } else {
                let id, value
                id = req.body.id
                console.log(id)
                value = { stock: math, status: 'No Stock' }

                const STOCK = await PRODUCTS.findByIdAndUpdate(id, value, { useFindAndModify: false }).exec()

                console.log(STOCK)


                if (!STOCK) {
                    res.send(false)
                } else {
                    res.send(true)
                }
            }
        } else {
            res.send('stock')
        }
    }
}

exports.cancelDetail = async (req, res) => {
    const key = req.params.key
    const stock = req.params.stock
    const ID = req.params.id

    const STOCK = await PRODUCTS.findOne({ product: key }).exec()

    if (!STOCK) {
        res.send(false)
        return
    }

    const DATA = await DETAILS.findByIdAndDelete(ID, req.body, { useFindAndModify: false }).exec()

    if (!DATA) {
        res.send(false)
        return
    } else {
        let value = { stock: Number(STOCK.stock) + Number(stock) }

        const VALUE = await PRODUCTS.findByIdAndUpdate(STOCK.id, value, { useFindAndModify: false }).exec()

        if (VALUE) {
            res.send(true)
            return 
        } else {
            res.send(false)
            return
        }
    }
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
    if (!req.session.user || req.session.role != 'admin') {
        res.redirect('/error404')
    }

    const HMTL = FS.readFileSync(PATH.join(__dirname, '../helpers/templates/detail.html'), 'utf-8')
    const FILE_NAME = 'REPORTE_DE_PRODUCTOS_' + req.params.key + '.pdf'

    const CONFIG = {
        headers: {
            'Authorization': `Bearer ${req.session.token}`
        }
    }

    AXIOS.get('http://localhost:443/api/details/' + req.params.key, CONFIG).then(function (detail) {
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
            VALIDATION.deleteFile("./docs/" + FILE_NAME)
        }).catch(err => {
            res.send(err)
        })
    })
}