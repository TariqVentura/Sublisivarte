//modulos y dependencias
const CATEGORIES = require('../models/categories')
const PRODUCTS = require('../models/products')
const AXIOS = require('axios')
const FECHA = require('node-datetime')
const PDF = require('pdf-creator-node')
const PATH = require('path')
const FS = require('fs')
const OPTIONS = require('../helpers/format/report')
const VALIDATION = require('../helpers/validations/reports')

//funcion asincrona para crear categoria
exports.createCategorie = async (req, res) => {
    //declaramos variables
    let category

    //validamos campos vacios
    if (req.body.categorie) {
        category = req.body.categorie
    } else {
        category = ''
    }

    //validamos espacios en blanco
    if (!category.trim()) {
        console.log('error campos vacios')
        res.send(false)
    } else {
        //creamos objeto con datos de la categoria
        const CATEGORIE = new CATEGORIES({
            categorie: req.body.categorie.trim(),
            status: req.body.status
        })

        //utilizamos un try para evitar datos repetidos
        try {
            //guardamos los datos
            await CATEGORIE.save()
            return res.send(true)
        } catch (error) {
            res.send('repetido')
        }
    }
}

//funcion para encontrar categoria
exports.findCategorie = (req, res) => {
    //validamos si es busqueda general o parametrizada
    if (req.query.id) {
        const ID = req.query.id
        //retornamos datos
        CATEGORIES.findById(ID)
            .then(data => {
                if (!data) {
                    AXIOS.get('http://localhost:443/api/categories')
                        .then(function (categorie) {
                            res.render('categorias', { categories: categorie.data, user: req.session, mensaje: "No se pudieron cargar las categorias", confirmation: true, icon: "error" })
                        })
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Ocurrio un error al intentar ejecutar el proceso" })
            })
    } else {
        //retornamos datos
        CATEGORIES.find()
            .then(categorie => {
                res.send(categorie)
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Ocurrio un error al tratar de obtener la informacion" })
            })
    }
}

//funcion para eliminar categorias
exports.deleteCategorie = (req, res) => {
    //obtenemos el id
    const ID = req.params.key

    //eliminamos la categoria
    CATEGORIES.findByIdAndDelete(ID, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.send(false)
            } else {
                res.send(true)
            }
        })
        .catch(err => {
            res.send(false)
        })
}

//cambio de estado
exports.categorieStatus = (req, res) => {
    //obtenemos el estado y el id de la categoria
    const STATUS = req.params.status
    const ID = req.params.id

    //creamos un objeto con los datos  
    const VALUE = { status: STATUS }

    //actualizamos
    CATEGORIES.findByIdAndUpdate(ID, VALUE, { useFindAndModify: false })
        .then(async data => {
            if (!data) {
                res.send(false)
            } else {
                if (STATUS == 'inactivo') {
                    try {
                        const CATEGORY = await CATEGORIES.findOne({ _id: ID }).exec()
                        const UPDATE_PRODUCT = await PRODUCTS.updateMany({ categorie: CATEGORY.categorie }, { status: 'inactivo' }, { useFindAndModify: false }).exec()
                        console.log(UPDATE_PRODUCT)
                        return res.send(true)
                    } catch (error) {
                        console.log(error)
                        return
                    }
                } else {
                    console.log(STATUS)
                }
                return res.send(true)
            }
        })
        .catch(err => {
            return res.send(false)
        })
}

// Funcion para buscar categorias
exports.searchCategories = (req, res) => {
    const KEY = req.params.key // Se obtiene el valor del parámetro 'key' de la solicitud.

    CATEGORIES.find(
        {
            "$or": [
                { categorie: { $regex: KEY } }, // Busca categorías que coincidan con 'KEY' (búsqueda de texto parcial).
                { status: { $regex: KEY } }     // Busca categorías que coincidan con 'KEY' en el campo 'status'.
            ]
        }
    ).then(data => {
        if (!data) {
            res.status(404).send({ message: `Sin datos` }) // Si no se encontraron datos, responde con un mensaje de error 404.
        } else {
            res.send(data) // Si se encontraron datos, responde con los datos encontrados.
        }
    }).catch(err => {
        res.send('err') // Si ocurre un error durante la búsqueda, responde con 'err'.
    })
}

//funcion para generar reporte
exports.getReport = (req, res) => {
    //validamos la sesion y el rol
    if (!req.session.user || req.session.role != 'admin') {
        res.redirect('/error404')
        return
    }
    //declaramos la plantilla y el nombre del archivo
    const HMTL = FS.readFileSync(PATH.join(__dirname, '../helpers/templates/report.html'), 'utf-8')
    const FILE_NAME = req.params.key + '.pdf'
    //obtenemos datso de la API
    AXIOS.get('http://localhost:443/api/view/products/' + req.params.key).then(function (product) {
        //alamcenamos los datos de la API
        let obj = product.data
        const NEW_DATE = FECHA.create()
        const DATE_FORMAT = NEW_DATE.format('Y-m-d H:M:S')

        //creamos un objeto con los datos para el reporte 
        const DATA = {
            category: req.params.key,
            user: req.session.user,
            obj: obj,
            newDate: DATE_FORMAT,
            product: req.params.key
        }


        //creamos un objeto con la configuracion del reporte
        const DOCUMENT = {
            html: HMTL,
            data: {
                data: DATA
            },
            path: "./docs/" + FILE_NAME,
            type: ""
        }

        PDF.create(DOCUMENT, OPTIONS).then(p => {
            //redirecciona al documento creado
            res.redirect('/' + FILE_NAME)
            //eliminamos el reporte del servidor
            VALIDATION.deleteFile("./docs/" + FILE_NAME)
        }).catch(err => {
            res.send(err)
        })
    })
}
