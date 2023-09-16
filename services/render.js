const AXIOS = require('axios')
const USER = require('../models/users')
const CODE = require('../models/code')
const FECHA = require('node-datetime')
let session, token, count = 1

exports.error = async (req, res) => {
    const COUNT = await USER.count().exec()

    if (COUNT > 0) {
        count = COUNT
    } else {
        count = 0
    }
    AXIOS.get('http://localhost:443/api/images')
        .then(function (images) {
            res.render('include/error', { user: false, resources: images.data, mensaje: ". ", confirmation: false, icon: " .", count: count })
        }).catch(err => {
            res.send('pagina no encontrada')
        })
}

exports.index = async (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }


    const COUNT = await USER.count().exec()

    if (COUNT > 0) {
        count = COUNT
    } else {
        count = 0
    }

    AXIOS.get('http://localhost:443/api/images')
        .then(function (images) {
            res.render('index', { user: session, resources: images.data, mensaje: ". ", confirmation: false, icon: " .", count: count })
        }).catch(err => {
            res.send('pagina no encontrada')
        })
}

exports.newAccount = async (req, res) => {
    const COUNT = await USER.count().exec()

    if (COUNT > 0) {
        count = COUNT
    } else {
        count = 0
    }

    res.render('account', { user: false, count: count })
}

exports.products = async (req, res) => {
    const COUNT = await USER.count().exec()

    if (COUNT > 0) {
        count = COUNT
    } else {
        count = 0
    }

    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    
    AXIOS.get('http://localhost:443/api/products')
        .then(function (response) {
            AXIOS.get('http://localhost:443/api/categories')
                .then(function (categorie) {
                    res.render('productos', { products: response.data, categories: categorie.data, user: session, mensaje: ". ", confirmation: false, icon: " .", count: count })
                })
                .catch(err => {
                    res.send('hola')
                })
        }).catch(err => {
            res.send('pagina no encontrada')
        })
}

exports.producto = async (req, res) => {
    const COUNT = await USER.count().exec()

    if (COUNT > 0) {
        count = COUNT
    } else {
        count = 0
    }

    if (req.session.user && req.session.token) {
        session = req.session
        token = req.session.token
        const CONFIG = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        AXIOS.get('http://localhost:443/api/products/' + req.params.id)
            .then(function (product) {
                AXIOS.get('http://localhost:443/api/orders/' + req.session.user, CONFIG)
                    .then(function (order) {
                        res.render('producto', { products: product.data, user: session, orders: order.data, count: count })
                    })
            })
            .catch(err => {
                res.send('pagina no encontrada')
            })
    } else {
        session = false
        AXIOS.get('http://localhost:443/api/products/' + req.params.id)
            .then(function (product) {
                res.render('producto', { products: product.data, user: session, orders: null, count: count })
            })
            .catch(err => {
                res.send('pagina no encontrada')
            })
    }

}

exports.categories = async (req, res) => {
    const COUNT = await USER.count().exec()

    if (COUNT > 0) {
        count = COUNT
    } else {
        count = 0
    }

    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }

    AXIOS.get('http://localhost:443/api/categories')
        .then(function (categorie) {
            res.render('categories', { categorie: categorie.data, user: session, count: count })
        }.catch(err => {
            res.send('pagina no encontrada')
        }))

}

exports.carrito = async (req, res) => {
    const COUNT = await USER.count().exec()

    if (COUNT > 0) {
        count = COUNT
    } else {
        count = 0
    }

    if (req.session.token) {
        token = req.session.token
    } else {
        res.redirect('/error404')
        return
    }

    const CONFIG = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    if (req.session.user) {
        session = req.session
        AXIOS.get('http://localhost:443/api/orders/' + req.session.user, CONFIG)
            .then(function (order) {
                res.render('carrito', { user: session, orders: order.data, count: count })
            }).catch(err => {
                res.send('pagina no encontrada')
            })
    } else {
        session = false
        res.render('carrito', { user: session })
    }
}

exports.details1 = async (req, res) => {
    const COUNT = await USER.count().exec()

    if (COUNT > 0) {
        count = COUNT
    } else {
        count = 0
    }

    if (req.session.user) {
        session = req.session
        AXIOS.get('http://localhost:443/api/details/' + req.params.id)
            .then(function (detail) {
                console.log(req.params.status)
                res.render('detalles', { user: session, details: detail.data, status: req.params.status, order: req.params.id, count: count })
            }).catch(err => {
                res.send('pagina no encontrada')
            })
    } else {
        session = false
        res.render('detalles', { user: session })
    }
}

exports.cuenta = async (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }

    if (req.session.token) {
        token = req.session.token
    } else {
        res.redirect('/error404')
        return
    }

    const CONFIG = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }

    let code
    let obj = await CODE.find({ user: req.session.user, status: 'activo' }).exec()

    if (!obj.length) {
        code = false
    } else {
        let newDate = FECHA.create()
        let createCode = Number(obj[0].date.substring(11, 13)) * 60 + Number(obj[0].date.substring(14, 16))
        let insertCode = Number(newDate.format('H')) * 60 + Number(newDate.format('M'))
        let date = insertCode - createCode
        if (obj[0].status == 'inactivo') {
            code =  false
        } else if (date <= 15 && newDate.format('Y-m-d') == obj[0].date.substring(0, 10)) {
            code =  true
        } else {
            //en caso de haber expirado cambiamos el estado a inactivo
            await CODE.findByIdAndUpdate(obj[0]._id, { status: 'inactivo' }, { useFindAndModify: false }).exec()
            code =  false
        }
    }

    AXIOS.get('http://localhost:443/api/get/users/' + req.session.user, CONFIG).then((info) => {
        res.render('cuenta', { user: session, data: info.data, count: count, code: code })
    })
}

exports.usuarios = async (req, res) => {
    const COUNT = await USER.count().exec()

    if (COUNT > 0) {
        count = COUNT
    } else {
        count = 0
    }

    if (req.session.token) {
        token = req.session.token
    } else {
        res.redirect('/error404')
        return
    }

    const CONFIG = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }

    AXIOS.get('http://localhost:443/api/users', CONFIG)
        .then(function (response) {
            if (response.data == false) {
                res.redirect('/error404')
            } else {
                res.render('usuarios', { users: response.data, user: req.session, mensaje: ". ", confirmation: false, icon: " .", count: count })
            }
        })
        .catch(err => {
            res.send('Pagina no encontrada')
        })
}

exports.administracion = async (req, res) => {
    const COUNT = await USER.count().exec()

    if (COUNT > 0) {
        count = COUNT
    } else {
        count = 0
    }

    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    res.render('administracion', { user: session, count: count })
}

exports.categorias = async (req, res) => {
    const COUNT = await USER.count().exec()

    if (COUNT > 0) {
        count = COUNT
    } else {
        count = 0
    }

    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/categories')
        .then(function (categorie) {
            res.render('categorias', { categories: categorie.data, user: session, mensaje: ". ", confirmation: false, icon: " .", count: count })
        })
        .catch(err => {
            res.send('Pagina no encontrada')
        })
}

exports.comments = async (req, res) => {
    const COUNT = await USER.count().exec()

    if (COUNT > 0) {
        count = COUNT
    } else {
        count = 0
    }

    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/comments')
        .then(function (comments) {
            AXIOS.get('http://localhost:443/api/products')
                .then(function (product) {
                    res.render('comentarios', { comments: comments.data, products: product.data, user: session, mensaje: ". ", confirmation: false, icon: " .", count: count })
                })
        })
        .catch(err => {
            res.send('pagina no encontrada')
        })
    // res.render('comentarios', {user: session})
}

exports.searchComments = async (req, res) => {
    const COUNT = await USER.count().exec()

    if (COUNT > 0) {
        count = COUNT
    } else {
        count = 0
    }

    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/comments' + '/' + req.params.key)
        .then(function (comments) {
            AXIOS.get('http://localhost:443/api/products')
                .then(function (product) {
                    console.log(comments.data)
                    res.render('comentarios', { comments: comments.data, products: product.data, user: session, mensaje: ". ", confirmation: false, icon: " .", count: count })
                }).catch(err => {
                    res.send('pagina no encontrada')
                })
        }).catch(err => {
            res.send('pagina no encontrada')
        })
}

exports.searchUser = async (req, res) => {
    const COUNT = await USER.count().exec()

    if (COUNT > 0) {
        count = COUNT
    } else {
        count = 0
    }

    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/users' + '/' + req.params.key)
        .then(function (user) {
            res.render('usuarios', { users: user.data, user: session, mensaje: ". ", confirmation: false, icon: " .", count: count })
        }).catch(err => {
            res.send('pagina no encontrada')
        })
}

exports.searchProduct = async (req, res) => {
    const COUNT = await USER.count().exec()

    if (COUNT > 0) {
        count = COUNT
    } else {
        count = 0
    }

    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/view/products/' + req.params.key)
        .then(function (response) {
            AXIOS.get('http://localhost:443/api/categories')
                .then(function (categorie) {
                    res.render('productos', { products: response.data, categories: categorie.data, user: session, mensaje: ". ", confirmation: false, icon: " .", count: count })
                })
                .catch(err => {
                    res.send('error de conexion')
                })
        })
        .catch(err => {
            res.send('pagina no encontrada')
        })
}

exports.viewProducts = async (req, res) => {
    const COUNT = await USER.count().exec()

    if (COUNT > 0) {
        count = COUNT
    } else {
        count = 0
    }

    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/categorie/api/products/' + req.params.key)
        .then(function (products) {
            res.render('viewPorducts', { user: session, products: products.data, mensaje: ". ", confirmation: false, icon: " .", count: count })
        }).catch(err => {
            res.send('pagina no encontrada')
        })
}

exports.newViewProducts = async (req, res) => {
    const COUNT = await USER.count().exec()

    if (COUNT > 0) {
        count = COUNT
    } else {
        count = 0
    }
    
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/view/products/' + req.params.key)
        .then(function (products) {
            res.render('viewPorducts', { user: session, products: products.data, mensaje: ". ", confirmation: false, icon: " .", count: count })
        }).catch(err => {
            res.send('pagina no encontrada')
        })
}

exports.allProducts = async (req, res) => {
    const COUNT = await USER.count().exec()

    if (COUNT > 0) {
        count = COUNT
    } else {
        count = 0
    }

    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/products')
        .then(function (products) {
            res.render('viewPorducts', { user: session, products: products.data, mensaje: ". ", confirmation: false, icon: " .", count: count })
        }).catch(err => {
            res.send('pagina no encontrada')
        })
}

exports.searchCategorie = async (req, res) => {
    const COUNT = await USER.count().exec()

    if (COUNT > 0) {
        count = COUNT
    } else {
        count = 0
    }

    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/categories' + '/' + req.params.key)
        .then(function (categorie) {
            res.render('categorias', { categories: categorie.data, user: session, mensaje: ". ", confirmation: false, icon: " .", count: count })
        })
        .catch(err => {
            res.send('pagina no encontrada')
        })
}

exports.orders = async (req, res) => {
    const COUNT = await USER.count().exec()

    if (COUNT > 0) {
        count = COUNT
    } else {
        count = 0
    }

    if (req.session.token) {
        token = req.session.token
    } else {
        res.redirect('/error404')
        return
    }

    const CONFIG = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    AXIOS.get('http://localhost:443/api/orders', CONFIG)
        .then(function (orders) {
            res.render('orders', { orders: orders.data, user: req.session, mensaje: ". ", confirmation: false, icon: " .", count: count })
        })
        .catch(err => {
            res.send('pagina no encontrada')
        })
}

exports.details = async (req, res) => {
    const COUNT = await USER.count().exec()

    if (COUNT > 0) {
        count = COUNT
    } else {
        count = 0
    }

    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/details/' + req.params.id)
        .then(function (details) {
            res.render('details', { details: details.data, user: session, mensaje: ". ", confirmation: false, icon: " .", count: count })
        }).catch(err => {
            res.send('pagina no encontrada')
        })
}

exports.ordersSearch = async (req, res) => {
    const COUNT = await USER.count().exec()

    if (COUNT > 0) {
        count = COUNT
    } else {
        count = 0
    }

    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/orders/' + req.params.key)
        .then(function (orders) {
            res.render('orders', { orders: orders.data, user: session, mensaje: ". ", confirmation: false, icon: " .", count: count })
        }).catch(err => {
            res.send('pagina no encontrada')
        })
}