const IMAGES = require('../models/images')

exports.saveImages = (req, res) => {
    if (!req.body.image) {
        res.send('no se permiten campos vacios')
    } else {
        const IMAGE = new IMAGES({
            image: req.body.image
        })

        IMAGE
            .save(IMAGE)
            .then(data => {
                if (!data) {
                    res.send('error')
                } else {
                    res.redirect('/')
                }
            })
    }
}

exports.getImages = (req, res) => {
    IMAGES.find()
        .then(data => {
            if (!data) {
                res.send('erorr')
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            res.send(err)
        })
}