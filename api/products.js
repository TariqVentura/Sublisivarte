/**
 * Se declaran las constantes para mandar a llamar al controlador y las dependencias de node
 */
const USERS = require('../models/products')
const AXIOS = require('axios')

/**
 * Por medio de la depencia de axios se obtiene la informacion de las API utilizando el metodo GET y se renderizan las paginas con la informacion obetnida
 * Haciendo uso ddel metodo SAVE de mongoose se guardan los datos en el servidor de Atlas
 */
exports.CreateProduct = (req, res)=> {
    if (!req.body.product || !req.body.price || !req.body.description) {
        res.status(404).send('No se permiten campos vacios')
    } else {
        const PRPDUCT = new PRPDUCTS({
            product: req.body.product,
            price: req.body.price,
            description: req.body.description,
            categorie: req.body.categorie,
            product: req.body.product,
            user: req.body.user,
            stock: req.body.stock,
            review: req.body.review,
            image: req.body.image,
            status: 'active'

        })
        PRPDUCTS
            .save(PRODUCTS)
            .then(data => {
                if (!data) {
                    res.status(404).send('Ocurrio un error al crear el Producto')
                } else {
                    res.send('Producto Creado')
                }
            })
            .catch(err => {
                res.send(err)
            })
    }
}