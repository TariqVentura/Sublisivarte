const MONGOOSE = require('mongoose')

let orderSchema = new MONGOOSE.Schema(
    {
        client: {
            type: String,
            require: true
        },
        name: {
            type: String,
            require: true
        },
        status: {
            type: ["en proceso", "finalizado", "cancelado", "oculto"],
            default: "en proceso"
        },
        date: {
            type: String,
            require: true
        }
    },
    {
        timestamps: false,
        versionKey: false
    }
)

const ORDERS = new MONGOOSE.model('orders', orderSchema)

module.exports = ORDERS