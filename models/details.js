const MONGOOSE = require('mongoose')

let detailSchema = new MONGOOSE.Schema(
    {
        product: {
            type: String,
            require: true
        },
        price: {
            type: Number,
            require: true
        },
        amount: {
            type: Number,
            require: true
        },
        total: {
            type: Number,
            require: true
        },
        order: {
            type: String,
            require: true
        },
        description: {
            type: String,
            require: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const DETAIL = new MONGOOSE.model('details', detailSchema)

module.exports = DETAIL