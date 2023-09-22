/**
 * Se declaran las constantes para mandar a llamar al controlador y las dependencias de node
 */
const PRODUCTS = require('../models/products')
const AXIOS = require('axios')
const FECHA = new Date()
const PDF = require('pdf-creator-node')
const PATH = require('path')
const FS = require('fs')
const OPTIONS = require('../helpers/format/product')
const OPTIONS2 = require('../helpers/format/stock')
const VALIDATION = require('../helpers/validations/reports')

/**
 * Por medio de la depencia de axios se obtiene la informacion de las API utilizando el metodo GET y se renderizan las paginas con la informacion obetnida
 * Haciendo uso ddel metodo SAVE de mongoose se guardan los datos en el servidor de Atlas
 */
exports.createProduct = async (req, res) => {
    if (!req.session.user || req.session.role != 'admin' ) {
        return res.redirect('/error404')
    }

    if (!req.body.product || !req.body.price || !req.body.categorie || !req.body.image || !req.body.stock) {
        return res.send('empty')
    } else {
        const PRODUCT_NAME = req.body.product
        const PRICE = req.body.price
        const CATEGORY = req.body.categorie
        const NEW_IMAGE = String(req.body.image).substring("C:/fakepath/".length)
        const STOCK = req.body.stock

        if (!PRODUCT_NAME.trim() || !PRICE.trim() || !CATEGORY.trim() || !NEW_IMAGE.trim() || !STOCK.trim()) {
            return res.send('empty')
        }

        if (NEW_IMAGE.includes('.png') == false && NEW_IMAGE.includes('.jpg') == false && NEW_IMAGE.includes('.jpeg') == false) {
            return res.send('format')
        }

        if (PRICE <= 0) {
            return res.send('price')
        }

        if (STOCK < 0) {
            return res.send('stock')
        }

        const COMPARE = await PRODUCTS.findOne({ product: PRODUCT_NAME }).exec()

        if (COMPARE) {
            return res.send('compare')
        }

        const PRODUCT = new PRODUCTS({
            product: PRODUCT_NAME,
            price: PRICE,
            categorie: CATEGORY,
            image: NEW_IMAGE,
            stock: STOCK,
            status: 'activo'
        })

        const SAVE = await PRODUCT.save()
        
        if (SAVE) {
            res.send(true)
        } else {
            res.send(false)
        }
    }
}

exports.findProduct = (req, res) => {
    if (req.params.id) {
        const id = req.params.id
        PRODUCTS.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "No se pudo encontrar este producto" })
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Ocurrio un error al intentar ejecutar el proceso" })
            })
    } else {
        PRODUCTS.find()
            .then(product => {
                res.send(product)
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Ocurrio un error al tratar de obtener la informacion" })
            })
    }
}

exports.updateProduct = async (req, res) => {
    if (!req.body.product || !req.body.price || !req.body.categorie || !req.body.status || !req.body.id) {
        return res.send('empty')
    } else {
        const PRODUCT_NAME = req.body.product
        const PRICE = req.body.price
        const CATEGORY = req.body.categorie
        const STATUS = req.body.status
        const ID = req.body.id

        console.log(PRODUCT_NAME + ' ' + PRICE + ' ' + CATEGORY + ' ' + STATUS)

        if (!PRODUCT_NAME.trim() || !PRICE.trim() || !CATEGORY.trim() || !STATUS.trim()) {
            return res.send('empty')
        }

        if (PRICE <= 0) {
            return res.send('price')
        }

        const COMPARE = await PRODUCTS.find({ product: PRODUCT_NAME }).exec()

        if (COMPARE.length > 1) {
            return res.send('compare')
        }

        const VALUE = {
            product: PRODUCT_NAME,
            price: PRICE,
            categorie: CATEGORY,
            status: STATUS
        }

        const UPDATE = await PRODUCTS.findByIdAndUpdate(ID, VALUE, { useFindAndModify: false }).exec()
        
        if (UPDATE) {
            return res.send(true)
        } else {
            return res.send(false)
        }
    }
}

exports.deleteProducts = (req, res) => {
    const ID = req.params.id

    PRODUCTS.findByIdAndDelete(ID, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.send(false)
            } else {
                return res.send(true)
            }
        })
}

exports.searchProduct = (req, res) => {
    const KEY = req.params.key
    PRODUCTS.find(
        {
            "$or": [
                { product: { $regex: KEY } },
                { categorie: { $regex: KEY } },
                { status: { $regex: KEY } }
            ]
        }
    )
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Sin datos` })
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            res.send(err)
        })
}

exports.categorieProduct = (req, res) => {
    const KEY = req.params.key
    PRODUCTS.find(
        {
            "$or": [
                { categorie: { $regex: KEY } }
            ]
        }
    )
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Sin datos` })
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            res.send(err)
        })
}

exports.countProducts = (req, res) => {
    //usamos un funcion de agregacion y filtramos a los productos que esten activos
    PRODUCTS.aggregate().group({
        //agrupamos los productos en categorias y contamos cuantos porductos tiene cada categoria
        _id: "$categorie",
        count: { $count: {} }
    }).then(data => {
        //enviamos la data
        res.send(data)
    }).catch(err => {
        res.status(404).send(err)
    })
}


exports.getStockReport = (req, res) => {
    if (!req.session.user || req.session.role != 'admin' ) {
        console.log(req.session.user)
        return res.redirect('/error404')
        
    }

    const CONFIG = {
        headers: {
            'Authorization': `Bearer ${req.session.token}`
        }
    }

    const HMTL = FS.readFileSync(PATH.join(__dirname, '../helpers/templates/stock.html'), 'utf-8')
    const FILE_NAME = 'REPORTE_DE_STOCK' + req.params.key + '.pdf'
    AXIOS.get('http://localhost:443/api/record/' + req.params.key, CONFIG).then(function (stock) {

        let obj = stock.data

        const DATA = {
            user: req.session.user,
            obj: obj,
            date: FECHA.toISOString().substring(0, 10) + ' ' + FECHA.getHours() + ':' + FECHA.getMinutes() + ':' + FECHA.getSeconds(),
            product: req.params.key
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
            res.redirect('/' + FILE_NAME)
            VALIDATION.deleteFile("./docs/" + FILE_NAME)
        }).catch(err => {
            res.send(err)
        })
    })
}

exports.countStockProducts = (req, res) => {
    //usamos un funcion de agregacion y filtramos a los productos que esten activos
    PRODUCTS.aggregate([
        { $match: { status: 'activo' } }, // Filtrar productos activos
        {
            $sort: { stock: -1 } // Ordenar de forma descendente por stock
        },
        {
            $limit: 5 // Obtener los 5 productos con más stock
        }
    ]).then(data => {
        //enviamos la data
        res.send(data)
    }).catch(err => {
        res.status(404).send(err)
    })
}

exports.reportProducts = (req, res) => {
    if (!req.session.user || req.session.role != 'admin' ) {
        res.redirect('/error404')
        return
    }
    const HMTL = FS.readFileSync(PATH.join(__dirname, '../helpers/templates/productos.html'), 'utf-8')
    const FILE_NAME2 = 'REPORTE_DE_PRODUCTOS.pdf'
    AXIOS.get('http://localhost:443/api/products/').then(function (products) {

        let obj = products.data, active = [], inactive = [], NoStock = []
        let newDate = FECHA.toISOString().substring(0, 10) + ' ' + FECHA.getHours() + ':' + FECHA.getMinutes() + ':' + FECHA.getSeconds()

        obj.forEach(i => {
            let filter = { product: i.product, price: i.price, stock: i.stock }
            if (i.status == 'activo') {
                active.push(filter)
            } else if (i.status == 'inactivo') {
                inactive.push(filter)
            } else if (i.status == 'No Stock') {
                NoStock.push(filter)
            }
        })

        const DATA = {
            user: req.session.user,
            active: active,
            inactive: inactive,
            NoStock: NoStock,
            date: newDate
        }

        const DOCUMENT1 = {
            html: HMTL,
            data: {
                data: DATA
            },
            path: "./docs/" + FILE_NAME2,
            type: ""
        }

        PDF.create(DOCUMENT1, OPTIONS).then(p => {
            res.redirect('/' + FILE_NAME2)
            VALIDATION.deleteFile("./docs/" + FILE_NAME2)
        }).catch(err => {
            res.send(err)
        })

    })
}

exports.countPriceProducts = (req, res) => {
    // Se inicia una función de agregación para obtener información de los productos en la base de datos
    PRODUCTS.aggregate([
        {
            // Filtra los productos por la categoría proporcionada en el parámetro de la solicitud
            $match: { categorie: req.params.key}
        },
        {
            $group: {
              _id: "$product",
              maxPrice: { $max: "$price" }
            }
        },
        {
            $sort: { maxPrice: -1 }
        },
        {
            $limit: 3
        }
    ]).then(data => {
        //Enviamos la informacion requerida
        res.send(data)
    }).catch(err => {
        res.status(404).send(err)
    })
}

exports.bulkInsert = (req, res) => {
    if (!req.body.file) {
        return res.send('empty')
    }

    const FILE_NAME = String(req.body.file).substring("C:/fakepath/".length)

    if (!FILE_NAME.trim()) {
        return res.send('empty')
    }

    if (!FILE_NAME.includes('.json')) {
        return res.send('format')
    }

    FS.access("./data/" + FILE_NAME, FS.constants.F_OK, async (err) => {
        if (err) {
            return res.send('file')
        } else {
            const PRODUCT_DATA = FS.readFileSync("./data/" + FILE_NAME)

            const PRODUCT_FORMAT = JSON.parse(PRODUCT_DATA)

            const SAVE_PRODUCT = await USERS.insertMany(PRODUCT_FORMAT)

            if (SAVE_PRODUCT) {
                return res.send(true)
            } else {
                return res.send(false)
            }
        }
    })
}