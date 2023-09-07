const CATEGORIES = require('../models/categories')
const AXIOS = require('axios')
const FECHA = new Date()
const PDF = require('pdf-creator-node')
const PATH = require('path')
const FS = require('fs')
const OPTIONS = require('../helpers/format/report')

exports.createCategorie = async (req, res) => {
    if (!req.session.user || req.session.role != 'admin' ) {
        res.redirect('/error404')
    }

    let category
    if (req.body.categorie) {
        category = req.body.categorie
    } else {
        category = ''
    }
    console.log(category)
    if (!category.trim()) {
        console.log('error campos vacios')
        res.send(false)
    } else {
        const CATEGORIE = new CATEGORIES({
            categorie: req.body.categorie.trim(),
            status: req.body.status
        })
        try {
            await CATEGORIE.save()
            res.send(true)
        } catch (error) {
            res.send('repetido')   
        }
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
    if (!req.session.user || req.session.role != 'admin' ) {
        res.redirect('/error404')
    }
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
    if (!req.session.user || req.session.role != 'admin' ) {
        res.redirect('/error404')
    }
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
    if (!req.session.user || req.session.role != 'admin' ) {
        res.redirect('/error404')
    }
    const STATUS = req.params.status
    const ID = req.params.id
    const VALUE = { status: STATUS }
    console.log(STATUS)
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

exports.searchCategories = (req, res) => {
    const key = req.params.key
    CATEGORIES.find(
        {
            "$or": [
                { categorie: { $regex: key } },
                { status: { $regex: key } }
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

exports.getReport = (req, res) => {
    if (!req.session.user || req.session.role != 'admin' ) {
        res.redirect('/error404')
    }
    const HMTL = FS.readFileSync(PATH.join(__dirname, '../helpers/templates/report.html'), 'utf-8')
    const FILE_NAME = req.params.key + '.pdf'
    AXIOS.get('http://localhost:443/api/view/products/' + req.params.key).then(function (product) {
        let obj = product.data
        let newDate = FECHA.toISOString().substring(0, 10) + ' ' + FECHA.getHours() + ':' + FECHA.getMinutes() + ':' + FECHA.getSeconds()
        const DATA = {
            category: req.params.key,
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
            //redirecciona al documento creado
            res.redirect('/' + FILE_NAME)
        }).catch(err => {
            res.send(err)
        })
    })
}

exports.changePassword90 = (req, res) =>{
    
}
