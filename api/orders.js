const ORDERS = require('../models/orders')
const AXIOS = require('axios')
const FECHA = new Date()

exports.createOrder = (req, res) => {
    if (!req.body.name) {
        res.status(404).send('no se permiten campos vacios')
    } else {
        //convertimos la fecha a formato ISO
        let newDate = FECHA.toISOString()

        const ORDER = new ORDERS({
            name: req.body.name,
            client: req.body.user,
            //le asignamos la fecha con formato ISO a date pero unicamente los primeros 10 caracteres
            date: newDate.substring(0, 10)
        })

        ORDER
            .save(ORDER)
            .then(data => {
                if (!data) {
                    res.status(404).send('error')
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.send(err)
            })
    }
}

exports.finishOrder = (req, res) => {
    const ID = req.params.id
    const VALUE = { status: 'finalizado' }

    ORDERS.findByIdAndUpdate(ID, VALUE, { useFindAndModify: true })
        .then(data => {
            if (!data) {
                res.send('err')
            } else {
                res.send('ok')
            }
        })
        .catch(err => {
            res.send(err)
        })
}

exports.getOrders = (req, res) => {
    if (req.params.key) {
        const KEY = req.params.key
        ORDERS.find({ $or: [{ client: { $regex: KEY } }, { status: { $regex: KEY } }, { name: { $regex: KEY } }] })
            .then((data) => {
                if (!data) {
                    res.send('no data')
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.send(err)
            })
    } else {
        ORDERS.find()
            .then(data => {
                if (!data) {
                    res.send('err')
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.send(err)
            })
    }

}

exports.cancelOrder = (req, res) => {
    const ID = req.params.id
    const VALUE = { status: 'cancelado' }

    ORDERS.findByIdAndUpdate(ID, VALUE, { useFindAndModify: true })
        .then(data => {
            if (!data) {
                res.send('err')
            } else {
                AXIOS.get('http://localhost:443/api/orders')
                    .then(function (orders) {
                        res.render('orders', { orders: orders.data, user: req.session, mensaje: "Pedido Cancelado", confirmation: true, icon: "success" })
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