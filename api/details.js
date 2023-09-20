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
    // Verifica si algún campo requerido (product, amount, price, order) falta en la solicitud.
    if (!req.body.product || !req.body.amount || !req.body.price || !req.body.order) {
        res.send('empty') // Si falta algún campo requerido, responde con 'empty' y sale de la función.
        return
    } else {
        let product, price, amount, order

        // Asigna los valores de los campos de la solicitud a variables locales.
        product = req.body.product
        price = req.body.price
        amount = req.body.amount
        order = req.body.order

        console.log(product + price + amount + order)

        // Verifica si alguno de los campos locales está vacío o contiene solo espacios en blanco.
        if (!product.trim() || !price.trim() || !amount.trim() || !order.trim()) {
            res.send('empty') // Si algún campo local está vacío o contiene solo espacios en blanco, responde con 'empty' y sale de la función.
            return
        }

        // Crea un objeto orderDetail con propiedades 'color', 'talla', e 'image' obtenidas de la solicitud.
        let orderDetail = { "color": req.body.color, "talla": req.body.size, "image": req.body.image }

        // Calcula el total multiplicando el precio por la cantidad y formatea el resultado con dos decimales.
        let total = Number(req.body.price) * Number(req.body.amount)

        // Calcula el nuevo valor de stock restando la cantidad de productos vendidos.
        let math = Number(req.body.stock) - Number(req.body.amount)

        // Crea una nueva instancia del modelo DETAILS con los datos proporcionados.
        const DETAIL = new DETAILS({
            product: product,
            price: price,
            amount: amount,
            total: total.toFixed(2),
            order: order,
            description: JSON.stringify(orderDetail)
        })

        if (math > 0) {
            // Si el stock es mayor que cero, guarda el detalle y actualiza el stock del producto.
            const SAVE = await DETAIL.save()

            if (!SAVE) {
                res.send(false) // Si no se guarda el detalle, responde con 'false'.
            } else {
                let id, value
                id = req.body.id
                value = { stock: math }

                // Actualiza el stock del producto en la base de datos.
                const STOCK = await PRODUCTS.findByIdAndUpdate(id, value, { useFindAndModify: false }).exec()

                console.log(STOCK)

                if (!STOCK) {
                    res.send(false) // Si no se actualiza el stock, responde con 'false'.
                } else {
                    res.send(true) // Si todo va bien, responde con 'true'.
                }
            }
        } else if (math == 0) {
            // Si el stock es igual a cero, guarda el detalle, actualiza el stock y establece el estado del producto como 'No Stock'.
            const SAVE = await DETAIL.save()

            console.log(SAVE)

            if (!SAVE) {
                res.send(false) // Si no se guarda el detalle, responde con 'false'.
            } else {
                let id, value
                id = req.body.id
                console.log(id)
                value = { stock: math, status: 'No Stock' }

                // Actualiza el stock y el estado del producto en la base de datos.
                const STOCK = await PRODUCTS.findByIdAndUpdate(id, value, { useFindAndModify: false }).exec()

                console.log(STOCK)

                if (!STOCK) {
                    res.send(false) // Si no se actualiza el stock, responde con 'false'.
                } else {
                    res.send(true) // Si todo va bien, responde con 'true'.
                }
            }
        } else {
            res.send('stock') // Si la cantidad vendida es mayor que el stock, responde con 'stock'.
        }
    }
}


exports.cancelDetail = async (req, res) => {
    const KEY = req.params.key // Obtiene el valor del parámetro 'key' de la solicitud.
    const PRODUCT_STOCK = req.params.stock // Obtiene el valor del parámetro 'stock' de la solicitud.
    const ID = req.params.id // Obtiene el valor del parámetro 'id' de la solicitud.

    // Busca el producto en la base de datos utilizando el valor de 'key'.
    const STOCK = await PRODUCTS.findOne({ product: KEY }).exec()

    if (!STOCK) {
        res.send(false) // Si no se encuentra el producto, responde con 'false' y sale de la función.
        return
    }

    // Busca y elimina el detalle de pedido utilizando el valor de 'ID'.
    const DATA = await DETAILS.findByIdAndDelete(ID, req.body, { useFindAndModify: false }).exec()

    if (!DATA) {
        res.send(false) // Si no se encuentra el detalle de pedido, responde con 'false' y sale de la función.
        return
    } else {
        // Calcula la nueva cantidad de stock sumando el stock actual del producto y el valor de 'stock' de la solicitud.
        let value = { stock: Number(STOCK.stock) + Number(PRODUCT_STOCK) }

        // Actualiza el stock del producto en la base de datos.
        const VALUE = await PRODUCTS.findByIdAndUpdate(STOCK.id, value, { useFindAndModify: false }).exec()

        if (VALUE) {
            res.send(true) // Si todo va bien, responde con 'true'.
            return
        } else {
            res.send(false) // Si no se puede actualizar el stock, responde con 'false'.
            return
        }
    }
}


exports.getDetails = (req, res) => {
    const ID = req.params.id // Obtiene el valor del parámetro 'id' de la solicitud.

    // Utiliza el método 'find' para buscar detalles de pedidos que coincidan con el valor de 'ID' en el campo 'order'.
    DETAILS.find({ $or: [{ order: { $regex: ID } }] }).then(data => {
        if (!data) {
            res.send('error') // Si no se encontraron datos, responde con 'error'.
        } else {
            res.send(data) // Si se encontraron datos, responde con los datos encontrados.
        }
    }).catch(err => {
        res.send(err) // Si ocurre un error durante la búsqueda, responde con el objeto de error.
    })
}


exports.getReportDetail = (req, res) => {
    // Verifica si no hay una sesión de usuario o si el rol no es 'admin', en cuyo caso redirige a la página de error 404.
    if (!req.session.user || req.session.role != 'admin') {
        res.redirect('/error404')
        return
    }

    // Lee el contenido HTML del archivo 'detail.html' ubicado en el directorio de ayuda y lo almacena en la variable 'HTML'.
    const HTML = FS.readFileSync(PATH.join(__dirname, '../helpers/templates/detail.html'), 'utf-8')

    // Define el nombre del archivo PDF que se generará.
    const FILE_NAME = 'REPORTE_DE_PRODUCTOS_' + req.params.key + '.pdf'

    // Configuración de encabezados para la solicitud AXIOS que parece estar utilizando autenticación JWT.
    const CONFIG = {
        headers: {
            'Authorization': `Bearer ${req.session.token}`
        }
    }

    // Realiza una solicitud AXIOS a la API para obtener detalles de productos basados en el parámetro 'key'.
    AXIOS.get('http://localhost:443/api/details/' + req.params.key, CONFIG).then(function (detail) {
        let obj = detail.data

        // Obtiene la fecha y hora actual en un formato específico.
        let newDate = FECHA.toISOString().substring(0, 10) + ' ' + FECHA.getHours() + ':' + FECHA.getMinutes() + ':' + FECHA.getSeconds()

        // Define un objeto 'DATA' que contiene información del usuario, detalles del producto, fecha y cliente.
        const DATA = {
            user: req.session.user,
            obj: obj,
            newDate: newDate,
            client: req.params.client
        }

        // Define un objeto 'DOCUMENT' que contiene el HTML, los datos y la ruta donde se guardará el PDF.
        const DOCUMENT = {
            html: HTML,
            data: {
                data: DATA
            },
            path: "./docs/" + FILE_NAME, // Ruta donde se guardará el PDF.
            type: ""
        }

        // Crea el PDF utilizando la biblioteca 'pdf-creator-node' con los datos proporcionados.
        PDF.create(DOCUMENT, OPTIONS2).then(p => {
            // Redirige al usuario al documento PDF generado.
            res.redirect('/' + FILE_NAME)

            // Elimina el archivo PDF generado después de la redirección.
            VALIDATION.deleteFile("./docs/" + FILE_NAME)
        }).catch(err => {
            res.send(err) // Si ocurre un error al generar el PDF, se responde con el objeto de error.
        })
    })
}
