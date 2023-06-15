const DETAILS = require('../models/details')
const PRODUCTS = require('../models/products')

exports.createDetail = (req, res) => {
    if (!req.body.product || !req.body.amount || !req.body.price || !req.body.order) {
        res.status(404).send('no se permiten campos vacios')
    } else {
        let total = Number(req.body.price) * Number(req.body.amount)

        const DETAIL = new DETAILS({
            product: req.body.product,
            price: req.body.price,
            amount: req.body.amount,
            total: total.toFixed(2),
            order: req.body.order
        })

        DETAIL
            .save(DETAIL)
            .then(data => {
                if (!data) {
                    res.status(404).send('error')
                } else {
                    let id, value
                    id = req.body.id
                    value = { stock: Number(req.body.stock) - Number(req.body.amount) }
                    PRODUCTS.findByIdAndUpdate(id, value, { useFindAndModify: false })
                        .then(product => {
                            if (!product) {
                                res.status(404).send('no se permiten campos vacios')
                            } else {
                                res.send('OK')
                            }
                        })
                }
            })
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