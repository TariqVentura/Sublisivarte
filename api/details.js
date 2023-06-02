const DETAILS = require('../models/details')
const PRODUCTS = require('../models/products')
let id, value

function updateStock(id, value) {
    PRODUCTS.findByIdAndUpdate(id, value, { useFindAndModify: false })
        .then(product => {
            if (!product) {
                res.status(404).send('no se permiten campos vacios')
            } else {
                res.send('OK')
            }
        })
}

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
                    id = req.body.id
                    value = { stock: Number(req.body.stock) - Number(req.body.amount) }
                    updateStock(id, value)
                }
            })
    }
}