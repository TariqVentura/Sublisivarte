const AXIOS = require('axios')

exports.index = (req, res) => {
    let session
    if (req.session.user) {
        session = req.session   
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/images')
    .then(function(images){
        res.render('index', { user: session, resources : images.data })
    })
}

exports.newAccount = (req, res) => {
    res.render('account', { user: false })
}