const CATEGORIES = require('../models/categories')
const AXIOS = require('axios')
const { categories } = require('../services/render')

exports.createCategorie = (req, res) => {
    if (!req.body.categorie ) {
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