const CATEGORIES = require('../models/categories')
const AXIOS = require('axios')

exports.createCategorie = (req, res) => {
    if (!req.body.categorie || !req.body.image) {

    } else {
        const CATEGORIES = new CATEGORIES({
            categorie: req.body.categorie,
            image: req.body.image,
            status: req.body.status
        })

        CATEGORIES
            .save(CATEGORIES)
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