const CATEGORIES = require('../models/categories')
const AXIOS = require('axios')

exports.createCategorie = (req, res) => {
    if (!req.body.categorie ) {
        res.status(404).send('no se permiten campos vacios')
    } else {
        const CATEGORIE = new CATEGORIES({
            categorie: req.body.categorie
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