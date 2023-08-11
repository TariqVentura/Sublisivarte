const CATEGORIES = require('../models/categories')
const AXIOS = require('axios')
const FECHA = new Date()
const PDF = require('pdf-creator-node')
const PATH = require('path')
const FS = require('fs')
const OPTIONS = require('../helpers/format/invoice')

exports.createCategorie = (req, res) => {
    if (!req.body.categorie) {
        AXIOS.get('http://localhost:443/api/categories')
            .then(function (categorie) {
                res.render('categorias', { categories: categorie.data, user: req.session, mensaje: "No se permten campos vacios", confirmation: true, icon: "error" })
            })
            .catch(err => {
                res.send('No se puede acceder a las categorias')
            })
    } else {
        const CATEGORIE = new CATEGORIES({
            categorie: req.body.categorie,
            status: req.body.status
        })

        CATEGORIE
            .save(CATEGORIE)
            .then(data => {
                if (!data) {
                    res.status(404).send('Ocurrio un error al crear la Categoria')
                } else {
                    AXIOS.get('http://localhost:443/api/categories')
                        .then(function (categorie) {
                            res.render('categorias', { categories: categorie.data, user: req.session, mensaje: "Categoria creada", confirmation: true, icon: "success" })
                        })
                        .catch(err => {
                            res.send('No se puede acceder a las categorias')
                        })
                }
            })
            .catch(err => {
                res.send(err)
            })
    }
}

exports.findCategorie = (req, res) => {
    if (req.query.id) {
        const id = req.query.id
        CATEGORIES.findById(id)
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
        CATEGORIES.find()
            .then(categorie => {
                res.send(categorie)
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Ocurrio un error al tratar de obtener la informacion" })
            })
    }
}

exports.updateCategorie = (req, res) => {
    console.log(req.body.id)
    const id = req.body.id
    CATEGORIES.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "No se encontro el usuario" })
            } else {
                AXIOS.get('http://localhost:443/api/categories')
                    .then(function (categorie) {
                        res.render('categorias', { categories: categorie.data, user: req.session, mensaje: "Categoria actualizada", confirmation: true, icon: "success" })
                    })
                    .catch(err => {
                        res.send('No se puede acceder a las categorias')
                    })
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error al intentar ejecutar el proceso" })
        })
}

exports.deleteCategorie = (req, res) => {
    const id = req.params.key
    CATEGORIES.findByIdAndDelete(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.send('error')
            } else {
                AXIOS.get('http://localhost:443/api/categories')
                    .then(function (categorie) {
                        res.render('categorias', { categories: categorie.data, user: req.session, mensaje: "Categoria eliminada", confirmation: true, icon: "success" })
                    })
                    .catch(err => {
                        res.send('No se puede acceder a las categorias')
                    })
            }
        })
        .catch(err => {
            res.send(err)
        })
}

exports.categorieStatus = (req, res) => {
    const STATUS = req.params.status
    const ID = req.params.id
    const VALUE = { status: STATUS }

    CATEGORIES.findByIdAndUpdate(ID, VALUE, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.send('error')
            } else {
                AXIOS.get('http://localhost:443/api/categories')
                    .then(function (categorie) {
                        res.render('categorias', { categories: categorie.data, user: req.session, mensaje: "estado cambiado", confirmation: true, icon: "success" })
                    })
                    .catch(err => {
                        res.send('No se puede acceder a las categorias')
                    })
            }
        })
            .catch(err => {
                res.send(err)
            })
}

exports.searchCategories = (req, res) =>{
    const key = req.params.key
    CATEGORIES.find(
        {
            "$or": [
                {categorie: {$regex:key}},
                {status: {$regex: key}}
            ]
        }
    )
    .then(data =>{
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

exports.getReport = (req, res) => {
    const HMTL = FS.readFileSync(PATH.join(__dirname, '../helpers/templates/report.html'), 'utf-8')
    const FILE_NAME = req.params.key + '.pdf'
    AXIOS.get('http://localhost:443/api/products/' + req.params.key).then(function (product) {
        let obj = product.data
        let newDate = FECHA.toISOString().substring(0, 10)
        const DATA = {
            user: req.session.user,
            obj: obj,
            newDate: newDate,
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
        PDF.create(DOCUMENT, OPTIONS).then(p => {
            //redirecciona al documento creato
            res.redirect('/' + FILE_NAME)
        }).catch(err => {
            res.send(err)
        })
    }) 
}

exports.countCategories = (req, res) => {
    //Usamos un funcion de agregacion y filtramos a los usuarios que esten activos e inactivos
    CATEGORIES.aggregate().group({
        //Agrupamos los usuarios en estados y contamos cuantos usuarios por estado hay.
        _id: "$categorie",
        count: { $count: {} }
    }).then(data => {
        //Enviamos la data
        res.send(data)
    }).catch(err => {
        res.status(404).send(err)
    })
}