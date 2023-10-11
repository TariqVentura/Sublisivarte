const COMMENTS = require('../../models/comments')

exports.oneComment = async (username, product) => {
    const SEARCH = await COMMENTS.find().and([ { client: username }, { product: product } ]).exec()
    console.log(SEARCH.length)
    if (SEARCH.length > 0) {
        return true
    } else {
        return false
    }
}