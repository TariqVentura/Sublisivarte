const ORDERS = require('../models/orders')
const AXIOS = require('axios')
const FECHA = new Date()
const PDF = require('pdf-creator-node')
const PATH = require('path')
const FS = require('fs')
const OPTIONS = require('../helpers/format/invoice')
const OPTIONS_2 = require('../helpers/format/order')
const VALIDATION = require('../helpers/validations/reports')


exports.createOrder = async (req, res) => {
    let name

    // Verifica si el campo 'name' no está presente en la solicitud.
    if (!req.body.name) {
        res.send('empty') // Si falta el campo 'name', responde con 'empty' y sale de la función.
        return
    }

    name = req.body.name // Asigna el valor del campo 'name' de la solicitud a la variable 'name'.

    // Verifica si 'name' contiene solo espacios en blanco o está vacío después de quitar los espacios en blanco.
    if (!name.trim()) {
        res.send('empty') // Si 'name' está vacío o contiene solo espacios en blanco, responde con 'empty' y sale de la función.
        return
    }

    // Convierte la fecha actual a formato ISO.
    let newDate = FECHA.toISOString()

    // Crea una nueva instancia de la orden ('ORDERS') con los datos proporcionados.
    const ORDER = new ORDERS({
        name: req.body.name,
        client: req.session.user,
        // Asigna la fecha actual en formato ISO (solo los primeros 10 caracteres) al campo 'date'.
        date: newDate.substring(0, 10),
        status: "en proceso"
    })

    // Guarda la orden en la base de datos.
    const SAVE = await ORDER.save()

    if (SAVE) {
        res.send(true) // Si se guarda la orden correctamente, responde con 'true'.
    } else {
        res.send(false) // Si no se puede guardar la orden, responde con 'false'.
    }
}


exports.finishOrder = (req, res) => {
    // Verifica si no hay un token de sesión. Si no hay sesión activa, redirige a una página de error.
    if (!req.session.token) {
        res.redirect('/images/Error 404.png') // Redirige a la página de error "Error 404.png" y sale de la función.
        return
    } else {
        const ID = req.params.id // Obtiene el valor del parámetro 'id' de la URL.
        let newDate = FECHA.toISOString().substring(0, 10) + ' ' + FECHA.getHours() + ':' + FECHA.getMinutes() + ':' + FECHA.getSeconds()

        const VALUE = { status: 'finalizado', date: newDate } // Define un objeto 'VALUE' con el nuevo estado y fecha.

        // Actualiza la orden ('ORDERS') con el ID proporcionado utilizando el objeto 'VALUE'.
        ORDERS.findByIdAndUpdate(ID, VALUE, { useFindAndModify: true })
            .then(data => {
                if (!data) {
                    res.send(false) // Si no se encuentra la orden, responde con 'false'.
                } else {
                    res.send(true) // Si se actualiza la orden correctamente, responde con 'true'.
                }
            })
            .catch(err => {
                res.send(err) // Si ocurre un error durante la actualización, responde con el objeto de error.
            })
    }
}


exports.cancelOrder = (req, res) => {
    const ID = req.params.id // Obtiene el valor del parámetro 'id' de la URL.
    const value = { status: 'cancelado' } // Define un objeto 'value' con el nuevo estado 'cancelado'.

    // Actualiza la orden ('ORDERS') con el ID proporcionado utilizando el objeto 'value'.
    ORDERS.findByIdAndUpdate(ID, value, { useFindAndModify: true })
        .then(data => {
            if (!data) {
                res.send(false) // Si no se encuentra la orden, responde con 'false'.
            } else {
                res.send(true) // Si se actualiza la orden correctamente, responde con 'true'.
            }
        })
        .catch(err => {
            res.send(false) // Si ocurre un error durante la actualización, responde con 'false'.
        })
}


exports.getOrders = (req, res) => {
    // Verifica si se proporciona un parámetro de búsqueda 'key'.
    if (req.params.key) {
        const KEY = req.params.key // Obtiene el valor del parámetro 'key' de la URL.

        // Utiliza el método 'find' para buscar órdenes que coincidan con 'KEY' en los campos 'client', 'status', o 'name'.
        ORDERS.find({ $or: [{ client: { $regex: KEY } }, { status: { $regex: KEY } }, { name: { $regex: KEY } }] })
            .then((data) => {
                if (!data) {
                    res.send('no data') // Si no se encuentran datos, responde con 'no data'.
                } else {
                    res.send(data) // Si se encuentran datos, responde con los datos encontrados.
                }
            })
            .catch(err => {
                res.send(err) // Si ocurre un error durante la búsqueda, responde con el objeto de error.
            })
    } else {
        // Si no se proporciona un parámetro 'key', busca y devuelve todas las órdenes.
        ORDERS.find()
            .then(data => {
                if (!data) {
                    res.send('err') // Si no se encuentran datos, responde con 'err'.
                } else {
                    res.send(data) // Si se encuentran datos, responde con todas las órdenes.
                }
            })
            .catch(err => {
                res.send(err) // Si ocurre un error durante la búsqueda, responde con el objeto de error.
            })
    }
}


exports.getInvoice = (req, res) => {
    if (!req.session.user) {
        res.redirect('/error404')
        return
    }
    //obetner la plantilla de la carpeta helpers/templates
    const HMTL = FS.readFileSync(PATH.join(__dirname, '../helpers/templates/invoice.html'), 'utf-8')
    //req.params.key es el id de la orden que se manda en la url 
    const FILE_NAME = req.params.key + '.pdf' 

    const CONFIG = {
        headers: {
            'Authorization': `Bearer ${req.session.token}`
        }
    }

    //obtener la data que se necesita
    AXIOS.get('http://localhost:443/api/details/' + req.params.key, CONFIG).then(function (detail) {
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
                VALIDATION.deleteFile("./docs/" + FILE_NAME)
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
        return
    }
    const HMTL = FS.readFileSync(PATH.join(__dirname, '../helpers/templates/detail.html'), 'utf-8')
    const FILE_NAME = 'REPORTE_DE_PRODUCTOS_' + req.params.key + '.pdf'

    const CONFIG = {
        headers: {
            'Authorization': `Bearer ${req.session.token}`
        }
    }

    AXIOS.get('http://localhost:443/api/details/', CONFIG).then(function (detail) {
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
            VALIDATION.deleteFile("./docs/" + FILE_NAME)
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
    if (!req.session.user || req.session.role != 'admin') {
        res.redirect('/error404')
        return
    }
    const HMTL = FS.readFileSync(PATH.join(__dirname, '../helpers/templates/order.html'), 'utf-8')
    const FILE_NAME = 'REPORTE_DE_ORDENES.pdf'

    const CONFIG = {
        headers: {
            'Authorization': `Bearer ${req.session.token}`
        }
    }

    AXIOS.get('http://localhost:443/api/orders/', CONFIG).then(function (order) {
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
            VALIDATION.deleteFile("./docs/" + FILE_NAME)
        }).catch(err => {
            res.send(err)
        })

    })
}