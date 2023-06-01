/**
 * Se declaran las constantes para mandar a llamar al controlador y las dependencias de node
 */
const USERS = require('../models/users')
const AXIOS = require('axios')

/**
 * Por medio de la depencia de axios se obtiene la informacion de las API utilizando el metodo GET y se renderizan las paginas con la informacion obetnida
 * Haciendo uso ddel metodo SAVE de mongoose se guardan los datos en el servidor de Atlas
 */
exports.createUser = (req, res) => {
    //validamos los campos para que no esten vacios
    if (!req.body.user || !req.body.name || !req.body.lastname || !req.body.email || !req.body.password || !req.body.document || !req.body.role) {
        res.status(404).send('No se permiten campos vacios')
    } else {
        const USER = new USERS({
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            user: req.body.user,
            password: req.body.password,
            document: req.body.document,
            role: req.body.role,
            status: 'active'
        })
        
        USERS
            .save(USERS)
            .then(data => {
                if (!data) {
                    res.status(404).send('Ocurrio un error al crear el usuario')
                } else {
                    res.send('usuario creado')
                }
            })
            .catch(err => {
                res.send(err)
            })
    }
}