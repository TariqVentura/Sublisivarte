const ORDERS = require('../models/orders')
const AXIOS = require('axios')
const FECHA = new Date()

exports.createOrder = (req, res) => {
    if (!req.body.name) {
        res.status(404).send('no se permiten campos vacios')
    } else {
        //convertimos la fecha a formato ISO
        let newDate = FECHA.toISOString

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

