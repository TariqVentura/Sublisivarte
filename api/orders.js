const ORDERS = require('../models/orders')
const AXIOS = require('axios')
const FECHA = new Date()
const PDF = require('pdf-creator-node')
const PATH = require('path')
const FS = require('fs')
const OPTIONS = require('../helpers/format/invoice')
const OPTIONS_2 = require('../helpers/format/order')
const VALIDATION = require('../helpers/validations/reports')

//funcion para crear ordenes
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

//Funcion para cancelar ordenes
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

//Funcion para cancelar ordenes
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

//Funcion para obtener ordenes
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

//Funcion para generar la factura
exports.getInvoice = (req, res) => {
    //La función comienza con una verificación de si el usuario ha iniciado sesión. Si no se cumple esta condición, se redirige al usuario a una página de error 404 y se detiene la ejecución de la función.
    if (!req.session.user) {
        res.redirect('/error404')
        return
    }
    //A continuación, se lee un archivo HTML que se utilizará como plantilla para la factura. El archivo se encuentra en la carpeta "helpers/templates" del proyecto y se lee utilizando la función "readFileSync" del módulo "fs".
    const HMTL = FS.readFileSync(PATH.join(__dirname, '../helpers/templates/invoice.html'), 'utf-8')
    //Se define un nombre de archivo para la factura que incluye el parámetro "key" de la solicitud HTTP.
    const FILE_NAME = req.params.key + '.pdf' 
    //Se crea un objeto de configuración para incluir el token de sesión del usuario en las cabeceras de la solicitud HTTP.
    const CONFIG = {
        headers: {
            'Authorization': `Bearer ${req.session.token}`
        }
    }
    //Se utiliza el módulo "axios" para realizar una solicitud HTTP GET a la API de órdenes del servidor local utilizando el parámetro "key" de la solicitud HTTP para obtener los detalles de la orden correspondiente. El resultado de la solicitud se almacena en la variable "order".
    AXIOS.get('http://localhost:443/api/details/' + req.params.key, CONFIG).then(function (detail) {
        //Se crea un objeto "DATA" que contiene los datos necesarios para generar la factura. Este objeto incluye los detalles de la orden y la fecha actual.
        let obj = detail.data, total = 0

        ORDERS.findById(req.params.key).then(data => {
            //creamos un forEach para calcular el total
            obj.forEach(i => {
                //se suman los atributos total del objeto que creamos
                total += i.total
            })

            // let newDate = FECHA.toISOString().substring(0, 10)

            //Se crea un objeto "DATA" que contiene los datos necesarios para generar la factura. Este objeto incluye los detalles de la orden y la fecha actual.
            const DATA = {
                user: req.session.user,
                obj: obj,
                date: data.date,
                total: total,
                order: req.params.key
            }

            //Se crea un objeto "DOCUMENT" que contiene la plantilla HTML, los datos de la orden y la ruta y el nombre de archivo para la factura PDF. El tipo de archivo se deja en blanco para que se determine automáticamente.
            const DOCUMENT = {
                html: HMTL,
                data: {
                    data: DATA
                },
                path: "./docs/" + FILE_NAME,
                type: ""
            }

            //Se utiliza el módulo "pdfkit" para crear el archivo PDF utilizando la plantilla HTML y los datos de la orden. El archivo se guarda en la carpeta "docs" del proyecto con el nombre definido anteriormente.
            PDF.create(DOCUMENT, OPTIONS).then(p => {
                //Si se genera correctamente el archivo PDF, se redirige al usuario a la página de la factura y se elimina el archivo PDF del servidor utilizando la función "deleteFile" del módulo "validation".
                res.redirect('/' + FILE_NAME)
                VALIDATION.deleteFile("./docs/" + FILE_NAME)
            }).catch(err => {
                res.send(err)
            })
        })
    })
}

//Obtiene el numero de ordenes de la tienda
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

//Obtiene el numero de ordenes de un cliente
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

//Obtiene el numero de ordenes por fecha
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

//Obtener el reporte de detalles
exports.getReportDetail = (req, res) => {
    //La función comienza con una verificación de si el usuario ha iniciado sesión y si su rol es de administrador. Si no se cumple esta condición, se redirige al usuario a una página de error 404 y se detiene la ejecución de la función.
    if (!req.session.user || req.session.role != 'admin') {
        res.redirect('/error404')
        return
    }
    //A continuación, se lee un archivo HTML que se utilizará como plantilla para el informe de productos. El archivo se encuentra en la carpeta "helpers/templates" del proyecto y se lee utilizando la función "readFileSync" del módulo "fs".
    const HMTL = FS.readFileSync(PATH.join(__dirname, '../helpers/templates/detail.html'), 'utf-8')
    //Se define un nombre de archivo para el informe de productos que incluye el parámetro "key" de la solicitud HTTP y se crea un objeto de configuración para incluir el token de sesión del usuario en las cabeceras de la solicitud HTTP.
    const FILE_NAME = 'REPORTE_DE_PRODUCTOS_' + req.params.key + '.pdf'
    const CONFIG = {
        headers: {
            'Authorization': `Bearer ${req.session.token}`
        }
    }
     //Se realiza una solicitud HTTP GET a la API de detalles de productos del servidor local utilizando el módulo "axios". El resultado de la solicitud se almacena en la variable "detail".
    AXIOS.get('http://localhost:443/api/details/', CONFIG).then(function (detail) {
        let obj = detail.data
        let newDate = FECHA.toISOString().substring(0, 10) + ' ' + FECHA.getHours() + ':' + FECHA.getMinutes() + ':' + FECHA.getSeconds()
    //Se crea un objeto "obj" que contiene los datos de los detalles de los productos obtenidos de la respuesta HTTP. Luego, se crea un objeto "DATA" que contiene los datos necesarios para generar el informe de productos. Este objeto incluye el nombre de usuario de la sesión, los detalles de los productos y la fecha actual.
        const DATA = {
            user: req.session.user,
            obj: obj,
            newDate: newDate
        }
        //Se crea un objeto "DOCUMENT" que contiene la plantilla HTML, los datos de los detalles de los productos y la ruta y el nombre de archivo para el informe PDF. El tipo de archivo se deja en blanco para que se determine automáticamente.
        const DOCUMENT = {
            html: HMTL,
            data: {
                data: DATA
            },
            path: "./docs/" + FILE_NAME,
            type: ""
        }
        //Se utiliza el módulo "pdfkit" para crear el archivo PDF utilizando la plantilla HTML y los datos de los detalles de los productos. El archivo se guarda en la carpeta "docs" del proyecto con el nombre definido anteriormente.
        PDF.create(DOCUMENT, OPTIONS2).then(p => {
            //Si se genera correctamente el archivo PDF, se redirige al usuario a la página del informe de productos y se elimina el archivo PDF del servidor utilizando la función "deleteFile" del módulo "validation".
            res.redirect('/' + FILE_NAME)
            VALIDATION.deleteFile("./docs/" + FILE_NAME)
        }).catch(err => {
            res.send(err)
        })
    })
}

// Funcion para las fechas de las ordenes
exports.dateOrders = (req, res) => {
    //La función comienza extrayendo la fecha de la solicitud HTTP utilizando el parámetro "key" de la URL.
    const FECHA = req.params.key
    //Se utiliza el método "match" de la función "aggregate" de MongoDB para buscar todas las órdenes que contengan la fecha especificada en su campo "date". El resultado de la búsqueda se almacena en la variable "data".
    ORDERS.aggregate().match({
        "$or": [
            { date: { $regex: FECHA } }
        ]
        //Se utiliza el método "group" de la función "aggregate" para agrupar las órdenes por estado y contar cuántas órdenes hay en cada estado. El resultado se almacena en un objeto con el campo "_id" que representa el estado y el campo "count" que representa el número de órdenes en ese estado.
    }).group({
        //Agrupamos las ordenes por estado y contamos cuantos ordene tiene cada estado
        _id: "$status",
        count: { $count: {} }
    }).then(data => {
        //Si no se encuentra ningún resultado, se devuelve un mensaje de error. De lo contrario, se devuelve el objeto JSON con los datos de recuento de órdenes.
        if (!data) {
            res.send('error')
        } else {
            res.send(data)
        }
    }).catch(err => {
        res.send(err)
    })
}

// Funcion para los reportes de las ordenes
exports.reportOrders = (req, res) => {
    //verificación de si el usuario ha iniciado sesión y si su rol es de administrador. Si no se cumple esta condición, se redirige al usuario a una página de error 404 y se detiene la ejecución de la función.
    if (!req.session.user || req.session.role != 'admin') {
        res.redirect('/error404')
        return
    }
    //A continuación, se lee un archivo HTML que se utilizará como plantilla para el informe de órdenes. El archivo se encuentra en la carpeta "helpers/templates" del proyecto y se lee utilizando la función "readFileSync" del módulo "fs".
    const HMTL = FS.readFileSync(PATH.join(__dirname, '../helpers/templates/order.html'), 'utf-8')
    //Se define un nombre de archivo para el informe de órdenes y se crea un objeto de configuración para incluir el token de sesión del usuario en las cabeceras de la solicitud HTTP.
    const FILE_NAME = 'REPORTE_DE_ORDENES.pdf'

    const CONFIG = {
        headers: {
            'Authorization': `Bearer ${req.session.token}`
        }
    }
    //Se realiza una solicitud HTTP GET a la API de órdenes del servidor local utilizando el módulo "axios". El resultado de la solicitud se almacena en la variable "order".
    AXIOS.get('http://localhost:443/api/orders/', CONFIG).then(function (order) {
        //Se crea un objeto "obj" que contiene los datos de las órdenes obtenidos de la respuesta HTTP. Luego, se crean dos arreglos vacíos, "finalizado" y "enProceso", que se utilizarán para almacenar las órdenes que estén en estado "finalizado" y "en proceso", respectivamente.
        let obj = order.data, finalizado = [], enProceso = []
        let newDate = FECHA.toISOString().substring(0, 10) + ' ' + FECHA.getHours() + ':' + FECHA.getMinutes() + ':' + FECHA.getSeconds()
        //Se itera sobre cada objeto en "obj" y se filtra según su estado. Si el estado es "finalizado", se agrega un objeto con los campos "client", "name" y "date" al arreglo "finalizado". Si el estado es "en proceso", se agrega un objeto con los mismos campos al arreglo "enProceso".
        obj.forEach(i => {
            let filter = { client: i.client, name: i.name, date: i.date }
            if (i.status == 'finalizado') {
                finalizado.push(filter)
            } else if (i.status == 'en proceso') {
                enProceso.push(filter)
            }
        })
        //Se crea un objeto "DATA" que contiene los datos necesarios para generar el informe de órdenes. Este objeto incluye el nombre de usuario de la sesión, las órdenes en estado "finalizado" y "en proceso", y la fecha actual.
        const DATA = {
            user: req.session.user,
            finalizado: finalizado,
            enProceso: enProceso,
            date: newDate
        }
        //Se crea un objeto "DOCUMENTS" que contiene la plantilla HTML, los datos de la orden y la ruta y el nombre de archivo para el informe PDF. El tipo de archivo se deja en blanco para que se determine automáticamente.
        const DOCUMENTS = {
            html: HMTL,
            data: {
                data: DATA
            },
            path: "./docs/" + FILE_NAME,
            type: ""
        }
        //Se utiliza el módulo "pdfkit" para crear el archivo PDF utilizando la plantilla HTML y los datos de la orden. El archivo se guarda en la carpeta "docs" del proyecto con el nombre definido anteriormente.
        PDF.create(DOCUMENTS, OPTIONS_2).then(p => {
            //Si se genera correctamente el archivo PDF, se redirige al usuario a la página del informe de órdenes y se elimina el archivo PDF del servidor utilizando la función "deleteFile" del módulo "validation".
            res.redirect('/' + FILE_NAME)
            VALIDATION.deleteFile("./docs/" + FILE_NAME)
        }).catch(err => {
            res.send(err)
        })

    })
}