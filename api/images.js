const IMAGES = require('../models/images')

exports.saveImages = async (req, res) => {
    if (!req.body.image) {
        return res.send('empty')
    } else {
        
        const NEW_IMAGE = String(req.body.image).substring("C:/fakepath/".length)

        if (NEW_IMAGE.includes('.png') == false && NEW_IMAGE.includes('.jpg') == false && NEW_IMAGE.includes('.jpeg') == false) {
            return res.send('format')
        }

        const IMAGE = new IMAGES({
            image: NEW_IMAGE
        })

        const SAVE = await IMAGE.save()

        if (SAVE) {
            return res.send(true)
        } else {
            return res.send(false)
        }
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