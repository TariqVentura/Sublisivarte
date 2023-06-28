const CATEGORIES = require('../models/categories')
const AXIOS = require('axios')

exports.createCategorie = (req, res) => {
    if (!req.body.categorie) {
        res.status(404).send('no se permiten campos vacios')
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
                    res.send('Categoria Creada')
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
                    res.status(404).send({ message: "No se pudo encontrar esta Categoria" })
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
                res.send('Categoria Actualizada')
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
                res.send('categoria eliminada')
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
                res.send('estado cambiado')
            }
        })
        .catch(err => {
            res.send(err)
        })
}