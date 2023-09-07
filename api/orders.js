const ORDERS = require('../models/orders')
const AXIOS = require('axios')
const FECHA = new Date()
const PDF = require('pdf-creator-node')
const PATH = require('path')
const FS = require('fs')
const OPTIONS = require('../helpers/format/invoice')
const OPTIONS_2 = require('../helpers/format/order')


exports.createOrder = (req, res) => {
    if (!req.session.user) {
        res.redirect('/images/Error 404.png')
    } else {
        if (!req.body.name) {
            res.status(404).send('no se permiten campos vacios')
        } else {
            //convertimos la fecha a formato ISO
            let newDate = FECHA.toISOString()

            const ORDER = new ORDERS({
                name: req.body.name,
                client: req.body.user,
                //le asignamos la fecha con formato ISO a date pero unicamente los primeros 10 caracteres
                date: newDate.substring(0, 10),
                status: "en proceso"
            })

            ORDER
                .save(ORDER)
                .then(data => {
                    if (!data) {
                        res.status(404).send('error')
                    } else {
                        res.redirect('/carrito')
                    }
                })
                .catch(err => {
                    res.send(err)
                })
        }
    }
}

exports.finishOrder = (req, res) => {
    if (!req.session.user) {
        res.redirect('/images/Error 404.png')
    } else {
        const ID = req.params.id
        let newDate = FECHA.toISOString().substring(0, 10) + ' ' + FECHA.getHours() + ':' + FECHA.getMinutes() + ':' + FECHA.getSeconds()

        console.log(newDate)

        const VALUE = { status: 'finalizado', date: newDate }

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
}

exports.cancelOrder = (req, res) => {
    if (!req.session.user) {
        res.redirect('/images/Error 404.png')
    } else {
        const ID = req.params.id
        const value = { status: 'cancelado' }

        ORDERS.findByIdAndUpdate(ID, value, { useFindAndModify: true })
            .then(data => {
                if (!data) {
                    res.send('err')
                } else {
                    AXIOS.get('http://localhost:443/api/orders')
                        .then(function (orders) {
                            res.render('orders', { orders: orders.data, user: req.session, mensaje: "Orden cancelada", confirmation: true, icon: "success" })
                        })
                        .catch(err => {
                            res.send('No se pudieron cargar las Categorias')
                        })
                }
            })
            .catch(err => {
                res.send(err)
            })
    }
}

exports.getOrders = (req, res) => {
    if (!req.session.user) {
        res.redirect('/error404')
    }
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
    if (!req.session.user) {
        res.redirect('/error404')
    }
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


exports.getInvoice = (req, res) => {
    if (!req.session.user || req.session.role != 'admin') {
        res.redirect('/error404')
    }
    //obetner la plantilla de la carpeta helpers/templates
    const HMTL = FS.readFileSync(PATH.join(__dirname, '../helpers/templates/invoice.html'), 'utf-8')
    //req.params.key es el id de la orden que se manda en la url 
    const FILE_NAME = req.params.key + '.pdf'

    //obtener la data que se necesita
    AXIOS.get('http://localhost:443/api/details/' + req.params.key).then(function (detail) {
        //crea un objeto para almacenar los datos que se pidieron y hacemos una variable total igualada a 0
        let obj = detail.data, total = 0

        //obtenemos la fecha de la orden con el id de la orden
        ORDERS.findById(req.params.key).then(data => {
            //creamos un forEach para calcular el total
            obj.forEach(i => {
                //se suman los atributos total del objeto que creamos
                total += i.total
            })

            // let newDate = FECHA.toISOString().substring(0, 10)

            // creamos un objeto DATA
            const DATA = {
                user: req.session.user,
                obj: obj,
                date: data.date,
                total: total,
                order: req.params.key
            }

            //Objeto DOCUMENT donde se almacena los datos que se le enviar a la dependencia
            const DOCUMENT = {
                html: HMTL,
                data: {
                    data: DATA
                },
                path: "./docs/" + FILE_NAME,
                type: ""
            }

            //ocupar metodo create y pasas parametros del documents y
            PDF.create(DOCUMENT, OPTIONS).then(p => {
                res.redirect('/' + FILE_NAME)
            }).catch(err => {
                res.send(err)
            })
        })
    })
}

exports.countOrders = (req, res) => {
    //Hacemos uso de una funcion de agregacion y obtenemos las ordenes de la tienda
    ORDERS.aggregate().group({
        //Agrupamos las ordenes por estado y contamos cuantos ordene tiene cada estado
        _id: "$status",
        count: { $count: {} }
    }).then(data => {
        //Enviamos la informacion requerida
        res.send(data)
    }).catch(err => {
        res.status(404).send(err)
    })
}

exports.countOrdersClient = (req, res) => {
    //Hacemos uso de una funcion de agregacion y obtenemos las ordenes de la tienda
    //Utilizamos match para filtrar los pedidos de un solo cliente
    ORDERS.aggregate().match({ client: req.params.key }).group({
        //Agrupamos las ordenes por estado y contamos cuantos ordene tiene cada estado
        _id: "$status",
        count: { $count: {} }
    }).then(data => {
        //Enviamos la informacion requerida
        res.send(data)
    }).catch(err => {
        res.status(404).send(err)
    })
}

exports.countOrdersDate = (req, res) => {
    //Hacemos uso de una funcion de agregacion y obtenemos las ordenes de la tienda
    //Utilizamos match para filtrar los pedidos de un solo cliente
    ORDERS.aggregate().match({ date: req.params.key }).group({
        //Agrupamos las ordenes por estado y contamos cuantos ordene tiene cada estado
        _id: "$status",
        count: { $count: {} }
    }).then(data => {
        //Enviamos la informacion requerida
        res.send(data)
    }).catch(err => {
        res.status(404).send(err)
    })
}



exports.getReportDetail = (req, res) => {
    if (!req.session.user || req.session.role != 'admin') {
        res.redirect('/error404')
    }
    const HMTL = FS.readFileSync(PATH.join(__dirname, '../helpers/templates/detail.html'), 'utf-8')
    const FILE_NAME = 'REPORTE_DE_PRODUCTOS_' + req.params.key + '.pdf'
    AXIOS.get('http://localhost:443/api/details/').then(function (detail) {
        let obj = detail.data
        let newDate = FECHA.toISOString().substring(0, 10) + ' ' + FECHA.getHours() + ':' + FECHA.getMinutes() + ':' + FECHA.getSeconds()

        const DATA = {
            user: req.session.user,
            obj: obj,
            newDate: newDate
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

exports.dateOrders = (req, res) => {
    const FECHA = req.params.key
    ORDERS.aggregate().match({
        "$or": [
            { date: { $regex: FECHA } }
        ]
    }).group({
        //Agrupamos las ordenes por estado y contamos cuantos ordene tiene cada estado
        _id: "$status",
        count: { $count: {} }
    }).then(data => {
        if (!data) {
            res.send('error')
        } else {
            res.send(data)
        }
    }).catch(err => {
        res.send(err)
    })
}


exports.reportOrders = (req, res) => {
    if (!req.session.user || req.session.role != 'admin' ) {
        res.redirect('/error404')
    }
    const HMTL = FS.readFileSync(PATH.join(__dirname, '../helpers/templates/order.html'), 'utf-8')
    const FILE_NAME = 'REPORTE_DE_ORDENES.pdf'
    AXIOS.get('http://localhost:443/api/orders/').then(function (order) {
        let obj = order.data, finalizado = [], enProceso = []
        let newDate = FECHA.toISOString().substring(0, 10) + ' ' + FECHA.getHours() + ':' + FECHA.getMinutes() + ':' + FECHA.getSeconds()

        obj.forEach(i => {
            let filter = { client: i.client, name: i.name, date: i.date }
            if (i.status == 'finalizado') {
                finalizado.push(filter)
            } else if (i.status == 'en proceso') {
                enProceso.push(filter)
            }
        })

        const DATA = {
            user: req.session.user,
            finalizado: finalizado,
            enProceso: enProceso,
            date: newDate
        }

        const DOCUMENTS = {
            html: HMTL,
            data: {
                data: DATA
            },
            path: "./docs/" + FILE_NAME,
            type: ""
        }

        PDF.create(DOCUMENTS, OPTIONS_2).then(p => {
            res.redirect('/' + FILE_NAME)
        }).catch(err => {
            res.send(err)
        })

    })
}