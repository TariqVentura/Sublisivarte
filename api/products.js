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
//Esta línea exporta una función asíncrona llamada "createProduct" que toma dos parámetros, una solicitud (req) y una respuesta (res).
exports.createProduct = async (req, res) => {
    //Esta línea comprueba si el usuario ha iniciado sesión y si su rol es "admin". Si no se cumple esta condición, la función redirige a la página de error 404.
    if (!req.session.user || req.session.role != 'admin') {
        return res.redirect('/error404')
    }
    //Esta línea comprueba si alguno de los campos requeridos para crear un nuevo producto está vacío. Si es así, la función devuelve una respuesta "empty".
    if (!req.body.product || !req.body.price || !req.body.categorie || !req.body.image || !req.body.stock) {
        return res.send('empty')
    } else {
        //Esta línea declara una constante llamada "PRODUCT_NAME" que se establece en el valor del campo "product" de la solicitud.
        const PRODUCT_NAME = req.body.product
        //Esta línea declara una constante llamada "PRICE" que se establece en el valor del campo "price" de la solicitud.
        const PRICE = req.body.price
        //Esta línea declara una constante llamada "CATEGORY" que se establece en el valor del campo "categorie" de la solicitud.
        const CATEGORY = req.body.categorie
        //Esta línea declara una constante llamada "NEW_IMAGE" que se establece en el valor del campo "image" de la solicitud. La función "substring" se utiliza para eliminar la ruta de archivo falsa que se agrega automáticamente a los campos de archivo de entrada en algunos navegadores.
        const NEW_IMAGE = String(req.body.image).substring("C:/fakepath/".length)
        //Esta línea declara una constante llamada "STOCK" que se establece en el valor del campo "stock" de la solicitud.
        const STOCK = req.body.stock
        //Esta línea comprueba si alguno de los campos requeridos para crear un nuevo producto está vacío después de eliminar los espacios en blanco. Si es así, la función devuelve una respuesta "empty".
        if (!PRODUCT_NAME.trim() || !PRICE.trim() || !CATEGORY.trim() || !NEW_IMAGE.trim() || !STOCK.trim()) {
            return res.send('empty')
        }
        //Esta línea comprueba si la extensión del archivo de imagen es válida. Si no es así, la función devuelve una respuesta "format".
        if (NEW_IMAGE.includes('.png') == false && NEW_IMAGE.includes('.jpg') == false && NEW_IMAGE.includes('.jpeg') == false) {
            return res.send('format')
        }
        //Esta línea comprueba si el precio del producto es menor o igual a cero. Si es así, la función devuelve una respuesta "price".
        if (PRICE <= 0) {
            return res.send('price')
        }
        //Esta línea comprueba si el stock del producto es menor que cero. Si es así, la función devuelve una respuesta "stock".
        if (STOCK < 0) {
            return res.send('stock')
        }
        //Esta línea utiliza el método "findOne" para buscar un producto en la base de datos que tenga el mismo nombre que el producto que se está intentando crear. La función "exec" se utiliza para ejecutar la consulta.
        const COMPARE = await PRODUCTS.findOne({ product: PRODUCT_NAME }).exec()
        //Esta línea comprueba si ya existe un producto con el mismo nombre en la base de datos. Si es así, la función devuelve una respuesta "compare".
        if (COMPARE) {
            return res.send('compare')
        }
        //Esta línea crea un nuevo objeto "PRODUCT" utilizando el modelo "PRODUCTS" y los valores de los campos proporcionados en la solicitud.
        const PRODUCT = new PRODUCTS({
            product: PRODUCT_NAME,
            price: PRICE,
            categorie: CATEGORY,
            image: NEW_IMAGE,
            stock: STOCK,
            status: 'activo'
        })
        //Esta línea guarda el nuevo objeto "PRODUCT" en la base de datos.
        const SAVE = await PRODUCT.save()
        //Esta línea comprueba si el objeto "PRODUCT" se ha guardado correctamente en la base de datos.
        if (SAVE) {
            //Si el objeto "PRODUCT" se ha guardado correctamente, esta línea devuelve una respuesta "true".
            res.send(true)
        } else {
            //Si el objeto "PRODUCT" no se ha guardado correctamente, esta línea devuelve una respuesta "false".
            res.send(false)
        }
    }
}
//Esta línea exporta una función llamada "findProduct" que toma dos parámetros, una solicitud (req) y una respuesta (res).
exports.findProduct = (req, res) => {
    //Esta línea comprueba si se ha proporcionado un parámetro de identificación en la solicitud.
    if (req.params.id) {
        //Esta línea declara una constante llamada "id" que se establece en el valor del parámetro de identificación de la solicitud.
        const id = req.params.id
        //Esta línea utiliza el método "findById" para buscar un producto en la base de datos utilizando el ID proporcionado.
        PRODUCTS.findById(id)
            //Si se encuentra un producto, esta línea ejecuta una función de devolución de llamada que toma el objeto de datos como parámetro.
            .then(data => {
                //Esta línea comprueba si el objeto de datos es nulo o indefinido.
                if (!data) {
                    //Si el objeto de datos es nulo o indefinido, esta línea devuelve una respuesta de estado 404 con un mensaje de error.
                    res.status(404).send({ message: "No se pudo encontrar este producto" })
                } else {
                    //Si se encuentra un objeto de datos, esta línea devuelve el objeto de datos como respuesta.
                    res.send(data)
                }
            })
            //Si se produce un error al buscar el producto, esta línea ejecuta una función de devolución de llamada que toma el objeto de error como parámetro.
            .catch(err => {
                //Esta línea devuelve una respuesta de estado 500 con un mensaje de error.
                res.status(500).send({ message: "Ocurrio un error al intentar ejecutar el proceso" })
            })
        //Esta línea cierra la función de devolución de llamada.
    } else {
        //Esta línea utiliza el método "find" para buscar todos los productos en la base de datos.
        PRODUCTS.find()
        //Si se encuentran productos, esta línea ejecuta una función de devolución de llamada que toma el objeto de productos como parámetro.
            .then(product => {
                //Esta línea devuelve el objeto de productos como respuesta.
                res.send(product)
            })
            //Si se produce un error al buscar los productos, esta línea ejecuta una función de devolución de llamada que toma el objeto de error como parámetro.
            .catch(err => {
                //Esta línea devuelve una respuesta de estado 500 con un mensaje de error.
                res.status(500).send({ message: err.message || "Ocurrio un error al tratar de obtener la informacion" })
            })
    }
}

//Esta línea exporta una función asíncrona llamada "updateProduct" que toma dos parámetros, una solicitud (req) y una respuesta (res).
exports.updateProduct = async (req, res) => {
    //Esta línea comprueba si alguno de los campos requeridos para actualizar un producto está vacío. Si es así, la función devuelve una respuesta "empty".
    if (!req.body.product || !req.body.price || !req.body.categorie || !req.body.status || !req.body.id) {
        return res.send('empty')
    } else {
        //Esta línea declara una constante llamada "PRODUCT_NAME" que se establece en el valor del campo "product" de la solicitud.
        const PRODUCT_NAME = req.body.product
        //Esta línea declara una constante llamada "PRICE" que se establece en el valor del campo "price" de la solicitud.
        const PRICE = req.body.price
        //Esta línea declara una constante llamada "CATEGORY" que se establece en el valor del campo "categorie" de la solicitud.
        const CATEGORY = req.body.categorie
        //Esta línea declara una constante llamada "STATUS" que se establece en el valor del campo "status" de la solicitud.
        const STATUS = req.body.status
        //Esta línea declara una constante llamada "ID" que se establece en el valor del campo "id" de la solicitud.
        const ID = req.body.id

        console.log(PRODUCT_NAME + ' ' + PRICE + ' ' + CATEGORY + ' ' + STATUS)
        //Esta línea comprueba si alguno de los campos requeridos para actualizar un producto está vacío después de eliminar los espacios en blanco. Si es así, la función devuelve una respuesta "empty".
        if (!PRODUCT_NAME.trim() || !PRICE.trim() || !CATEGORY.trim() || !STATUS.trim()) {
            return res.send('empty')
        }
        //Esta línea comprueba si el precio del producto es menor o igual a cero. Si es así, la función devuelve una respuesta "price".
        if (PRICE <= 0) {
            return res.send('price')
        }
        //Esta línea utiliza el método "find" para buscar productos en la base de datos que tengan el mismo nombre que el producto que se está intentando actualizar. La función "exec" se utiliza para ejecutar la consulta.
        const COMPARE = await PRODUCTS.find({ product: PRODUCT_NAME }).exec()
        //Esta línea comprueba si hay más de un producto con el mismo nombre en la base de datos. Si es así, la función devuelve una respuesta "compare".
        if (COMPARE.length > 1) {
            return res.send('compare')
        }
        //Esta línea declara una constante llamada "VALUE" que se establece en un objeto que contiene los campos actualizados del producto.
        const VALUE = {
            product: PRODUCT_NAME,
            price: PRICE,
            categorie: CATEGORY,
            status: STATUS
        }
        //Esta línea utiliza el método "findByIdAndUpdate" para actualizar el producto en la base de datos utilizando el ID proporcionado y el objeto "VALUE". La opción "useFindAndModify" se establece en "false" para utilizar la nueva API de MongoDB.
        const UPDATE = await PRODUCTS.findByIdAndUpdate(ID, VALUE, { useFindAndModify: false }).exec()
        //Si se actualiza el producto, esta línea devuelve una respuesta "true".
        if (UPDATE) {
            //Esta línea devuelve una respuesta "true".
            return res.send(true)
        } else {
            //Si no se actualiza el producto, esta línea devuelve una respuesta "false".
            return res.send(false)
        }
    }
}

//Esta línea exporta una función llamada "deleteProducts" que toma dos parámetros, una solicitud (req) y una respuesta (res).
exports.deleteProducts = (req, res) => {
    //Esta línea declara una constante llamada "ID" que se establece en el valor del parámetro de identificación de la solicitud.
    const ID = req.params.id
    //Esta línea utiliza el método "findByIdAndDelete" para buscar y eliminar un producto en la base de datos utilizando el ID proporcionado. La opción "useFindAndModify" se establece en "false" para utilizar la nueva API de MongoDB.
    PRODUCTS.findByIdAndDelete(ID, req.body, { useFindAndModify: false })
    //Si se elimina el producto, esta línea devuelve una respuesta "true".
        .then(data => {
            //Si no se elimina el producto, esta línea devuelve una respuesta "false".
            if (!data) {
                //Esta línea devuelve una respuesta "false".
                res.send(false)
            } else {
                //Esta línea devuelve una respuesta "true".
                return res.send(true)
            }
        })
}

//Esta línea exporta una función llamada "searchProduct" que toma dos parámetros, una solicitud (req) y una respuesta (res).
exports.searchProduct = (req, res) => {
    //Esta línea declara una constante llamada "KEY" que se establece en el valor del parámetro de búsqueda de la solicitud.
    const KEY = req.params.key
    //Esta línea utiliza el método "find" para buscar productos en la base de datos que coincidan con la palabra clave proporcionada.
    PRODUCTS.find(
        {
            //Esta línea utiliza el operador "$or" para buscar productos que coincidan con cualquiera de las siguientes condiciones:
            "$or": [
                //Esta línea busca productos que contengan la palabra clave en el campo "product".
                { product: { $regex: KEY } },
                //Esta línea busca productos que contengan la palabra clave en el campo "categorie".
                { categorie: { $regex: KEY } },
                //Esta línea busca productos que contengan la palabra clave en el campo "status".
                { status: { $regex: KEY } }
            ]
        }
    )
        //Si se encuentran productos, esta línea ejecuta una función de devolución de llamada que toma el objeto de datos como parámetro.
        .then(data => {
            //Esta línea comprueba si el objeto de datos es nulo o indefinido.
            if (!data) {
                //Si el objeto de datos es nulo o indefinido, esta línea devuelve una respuesta de estado 404 con un mensaje de error.
                res.status(404).send({ message: `Sin datos` })
                //Si se encuentra un objeto de datos, esta línea devuelve el objeto de datos como respuesta.
            } else {
                res.send(data)
            }
        })
        //Si se produce un error al buscar los productos, esta línea ejecuta una función de devolución de llamada que toma el objeto de error como parámetro.
        .catch(err => {
            res.send(err)
        })
}
//Esta línea exporta una función llamada "categorieProduct" que toma dos parámetros, una solicitud (req) y una respuesta (res).
exports.categorieProduct = (req, res) => {
    //Esta línea declara una constante llamada "KEY" que se establece en el valor del parámetro de categoría de la solicitud.
    const KEY = req.params.key
    //Esta línea utiliza el método "find" para buscar productos en la base de datos que coincidan con la categoría proporcionada.
    PRODUCTS.find(
        {
            //Esta línea utiliza el operador "$or" para buscar productos que coincidan con la siguiente condición:
            "$or": [
                //Esta línea busca productos que contengan la categoría en el campo "categorie".
                { categorie: { $regex: KEY } }
            ]
        }
    )
        //Si se encuentran productos, esta línea ejecuta una función de devolución de llamada que toma el objeto de datos como parámetro.
        .then(data => {
            //Esta línea comprueba si el objeto de datos es nulo o indefinido.
            if (!data) {
                //Si el objeto de datos es nulo o indefinido, esta línea devuelve una respuesta de estado 404 con un mensaje de error.
                res.status(404).send({ message: `Sin datos` })
                //Si se encuentra un objeto de datos, esta línea devuelve el objeto de datos como respuesta.
            } else {
                res.send(data)
            }
        })
        //Si se produce un error al buscar los productos, esta línea ejecuta una función de devolución de llamada que toma el objeto de error como parámetro.
        .catch(err => {
            res.send(err)
        })
}

//Esta línea exporta una función llamada "countProducts" que toma dos parámetros, una solicitud (req) y una respuesta (res).
exports.countProducts = (req, res) => {
    //usamos un funcion de agregacion y filtramos a los productos que esten activos
    PRODUCTS.aggregate().group({
        //agrupamos los productos en categorias y contamos cuantos porductos tiene cada categoria
        _id: "$categorie",
        count: { $count: {} }
    }).then(data => {
        //enviamos la data
        res.send(data)
        //Si se produce un error al buscar los productos, esta línea ejecuta una función de devolución de llamada que toma el objeto de error como parámetro.
    }).catch(err => {
        res.status(404).send(err)
    })
}

//Esta línea exporta una función llamada "getStockReport" que toma dos parámetros, una solicitud (req) y una respuesta (res).
exports.getStockReport = (req, res) => {
    //Esta línea comprueba si el usuario ha iniciado sesión y si su rol es "admin". Si el usuario no ha iniciado sesión o no tiene el rol de "admin", se redirige a la página de error 404.
    if (!req.session.user || req.session.role != 'admin') {
        console.log(req.session.user)
        return res.redirect('/error404')

    }
    //Esta línea declara una constante llamada "CONFIG" que se establece en un objeto que contiene la información de autenticación necesaria para realizar una solicitud a la API.
    const CONFIG = {
        //Esta línea establece el campo "headers" del objeto "CONFIG".
        headers: {
            //Esta línea establece el campo "Authorization" del objeto "headers" en el valor del token de sesión de la solicitud.
            'Authorization': `Bearer ${req.session.token}`
        }
    }
    //Esta línea lee el archivo HTML de la plantilla de informe de stock y lo almacena en la constante "HMTL".
    const HMTL = FS.readFileSync(PATH.join(__dirname, '../helpers/templates/stock.html'), 'utf-8')
    //Esta línea declara una constante llamada "FILE_NAME" que se establece en el nombre del archivo PDF que se generará.
    const FILE_NAME = 'REPORTE_DE_STOCK' + req.params.key + '.pdf'
    //Esta línea utiliza el método "get" de Axios para realizar una solicitud a la API y obtener los datos de stock. La función de devolución de llamada toma el objeto de datos como parámetro.
    AXIOS.get('http://localhost:443/api/record/' + req.params.key, CONFIG).then(function (stock) {
        //Esta línea declara una variable llamada "obj" que se establece en el objeto de datos de stock.
        let obj = stock.data
        //Esta línea declara una constante llamada "DATA" que se establece en un objeto que contiene la información necesaria para generar el informe de stock.
        const DATA = {
            //Esta línea establece el campo "user" del objeto "DATA" en el valor del usuario de sesión de la solicitud.
            user: req.session.user,
            //Esta línea establece el campo "obj" del objeto "DATA" en el valor del objeto de datos de stock.
            obj: obj,
            //Esta línea establece el campo "date" del objeto "DATA" en el valor de la fecha y hora actuales.
            date: FECHA.toISOString().substring(0, 10) + ' ' + FECHA.getHours() + ':' + FECHA.getMinutes() + ':' + FECHA.getSeconds(),
            //Esta línea establece el campo "product" del objeto "DATA" en el valor del parámetro de clave de la solicitud.
            product: req.params.key
        }
        //Esta línea declara una constante llamada "DOCUMENT" que se establece en un objeto que contiene la información necesaria para generar el informe de stock en formato PDF.
        const DOCUMENT = {
            //Esta línea establece el campo "html" del objeto "DOCUMENT" en el valor de la plantilla HTML del informe de stock.
            html: HMTL,
            //Esta línea establece el campo "data" del objeto "DOCUMENT" en un objeto que contiene el objeto "DATA".
            data: {
                data: DATA
            },
            //Esta línea establece el campo "path" del objeto "DOCUMENT" en el valor de la ruta de archivo donde se guardará el informe de stock en formato PDF.
            path: "./docs/" + FILE_NAME,
            //Esta línea establece el campo "type" del objeto "DOCUMENT" en una cadena vacía.
            type: ""
        }
        //Esta línea utiliza el método "create" de la biblioteca "pdfkit" para generar el informe de stock en formato PDF. La función de devolución de llamada toma el objeto PDF como parámetro.
        PDF.create(DOCUMENT, OPTIONS2).then(p => {
            //Esta línea redirige al usuario a la página del informe de stock en formato PDF.
            res.redirect('/' + FILE_NAME)
            //Esta línea elimina el archivo PDF generado después de que el usuario haya descargado el informe.
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
//Esta línea exporta una función llamada "reportProducts" que toma dos parámetros, una solicitud (req) y una respuesta (res).
exports.reportProducts = (req, res) => {
    //Esta línea comprueba si el usuario ha iniciado sesión y si su rol es "admin". Si el usuario no ha iniciado sesión o no tiene el rol de "admin", se redirige a la página de error 404.
    if (!req.session.user || req.session.role != 'admin') {
        res.redirect('/error404')
        return
    }
    //Esta línea lee el archivo HTML de la plantilla de informe de productos y lo almacena en la constante "HMTL".
    const HMTL = FS.readFileSync(PATH.join(__dirname, '../helpers/templates/productos.html'), 'utf-8')
    //Esta línea declara una constante llamada "FILE_NAME2" que se establece en el nombre del archivo PDF que se generará.
    const FILE_NAME2 = 'REPORTE_DE_PRODUCTOS.pdf'
    //Esta línea utiliza el método "get" de Axios para realizar una solicitud a la API y obtener los datos de productos. La función de devolución de llamada toma el objeto de datos como parámetro.
    AXIOS.get('http://localhost:443/api/products/').then(function (products) {
        //Esta línea declara tres variables, "obj", "active", "inactive" y "NoStock", que se establecen en los datos de productos y tres matrices vacías.
        let obj = products.data, active = [], inactive = [], NoStock = []
        //Esta línea declara una variable llamada "newDate" que se establece en la fecha y hora actuales.
        let newDate = FECHA.toISOString().substring(0, 10) + ' ' + FECHA.getHours() + ':' + FECHA.getMinutes() + ':' + FECHA.getSeconds()
        //Esta línea utiliza el método "forEach" para iterar sobre los datos de productos y realizar una acción para cada elemento.
        obj.forEach(i => {
            //Esta línea declara una variable llamada "filter" que se establece en un objeto que contiene el nombre del producto, el precio y el stock.
            let filter = { product: i.product, price: i.price, stock: i.stock }
            //Esta línea comprueba si el estado del producto es "activo".
            if (i.status == 'activo') {
                //Si el estado del producto es "activo", esta línea agrega el objeto "filter" a la matriz "active".
                active.push(filter)
                //Si el estado del producto no es "activo", esta línea comprueba si el estado del producto es "inactivo".
            } else if (i.status == 'inactivo') {
                //Si el estado del producto es "inactivo", esta línea agrega el objeto "filter" a la matriz "inactive".
                inactive.push(filter)
                //Si el estado del producto no es "activo" ni "inactivo", esta línea comprueba si el estado del producto es "No Stock".
            } else if (i.status == 'No Stock') {
                //Si el estado del producto es "No Stock", esta línea agrega el objeto "filter" a la matriz "NoStock".
                NoStock.push(filter)
            }
        })
        //Esta línea declara una constante llamada "DATA" que se establece en un objeto que contiene la información necesaria para generar el informe de productos.
        const DATA = {
            user: req.session.user,
            active: active,
            inactive: inactive,
            NoStock: NoStock,
            date: newDate
        }
        //Esta línea declara una constante llamada "DOCUMENT1" que se establece en un objeto que contiene la información necesaria para generar el informe de productos en formato PDF.
        const DOCUMENT1 = {
            //Esta línea establece el campo "html" del objeto "DOCUMENT1" en el valor de la plantilla HTML del informe de productos.
            html: HMTL,
            //Esta línea establece el campo "data" del objeto "DOCUMENT1" en un objeto que contiene el objeto "DATA".
            data: {
                //Esta línea establece el campo "data" del objeto "data" en el valor del objeto "DATA".
                data: DATA
            },
            //Esta línea establece el campo "path" del objeto "DOCUMENT1" en el valor de la ruta de archivo donde se guardará el informe de productos en formato PDF.
            path: "./docs/" + FILE_NAME2,
            //Esta línea establece el campo "type" del objeto "DOCUMENT1" en una cadena vacía.
            type: ""
        }
        //Esta línea utiliza el método "create" de la biblioteca "pdfkit" para generar el informe de productos en formato PDF. La función de devolución de llamada toma el objeto PDF como parámetro.
        PDF.create(DOCUMENT1, OPTIONS).then(p => {
            //Esta línea redirige al usuario a la página del informe de productos en formato PDF.
            res.redirect('/' + FILE_NAME2)
            //Esta línea elimina el archivo PDF generado después de que el usuario haya descargado el informe.
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
            $match: { categorie: req.params.key }
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
//Esta línea exporta una función llamada "bulkInsert" que toma dos parámetros, una solicitud (req) y una respuesta (res).
exports.bulkInsert = (req, res) => {
    //Esta línea comprueba si el archivo JSON se ha proporcionado en la solicitud. Si no se ha proporcionado, se devuelve una respuesta "empty".
    if (!req.body.file) {
        //Esta línea devuelve una respuesta "empty".
        return res.send('empty')
    }
    //Esta línea declara una constante llamada "FILE_NAME" que se establece en el nombre del archivo JSON que se va a insertar.
    const FILE_NAME = String(req.body.file).substring("C:/fakepath/".length)
    //Esta línea comprueba si el nombre del archivo está vacío. Si el nombre del archivo está vacío, se devuelve una respuesta "empty".
    if (!FILE_NAME.trim()) {
        return res.send('empty')
    }
    //Esta línea comprueba si el archivo no tiene la extensión ".json". Si el archivo no tiene la extensión ".json", se devuelve una respuesta "format".
    if (!FILE_NAME.includes('.json')) {
        return res.send('format')
    }
    //Esta línea utiliza el método "access" de la biblioteca "fs" para comprobar si el archivo JSON existe en el directorio "data". La función de devolución de llamada toma un objeto de error como parámetro.
    FS.access("./data/" + FILE_NAME, FS.constants.F_OK, async (err) => {
        if (err) {
            return res.send('file')
            //Si se encuentra el archivo JSON, esta línea lee el archivo y lo almacena en la constante "PRODUCT_DATA".
        } else {
            //Esta línea lee el archivo JSON y lo almacena en la constante "PRODUCT_DATA".
            const PRODUCT_DATA = FS.readFileSync("./data/" + FILE_NAME)
            //Esta línea convierte el archivo JSON en un objeto JavaScript y lo almacena en la constante "PRODUCT_FORMAT".
            const PRODUCT_FORMAT = JSON.parse(PRODUCT_DATA)
            //Esta línea utiliza el método "insertMany" de MongoDB para insertar los documentos en la colección "USERS". La función devuelve una promesa que se resuelve en un objeto que contiene información sobre la operación de inserción.
            const SAVE_PRODUCT = await USERS.insertMany(PRODUCT_FORMAT)
            //Si se insertan los documentos correctamente, esta línea devuelve una respuesta "true".
            if (SAVE_PRODUCT) {
                return res.send(true)
            } else {
                return res.send(false)
            }
        }
    })
}