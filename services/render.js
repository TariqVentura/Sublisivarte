const AXIOS = require('axios')

exports.index = (req, res) => {
    let session
    if (req.session.user) {
        session = req.session.user
        res.render('index', {user: session})
    } else {
        res.render('index', { user: false })
    }
    
}