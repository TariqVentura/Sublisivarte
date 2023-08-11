const MONGOOSE = require('mongoose')

let recordSchema = new MONGOOSE.Schema(
    {
        product: {
            type: String,
            require: true
        },
        stock: {
            type: Number,
            require: true
        },
        date: {
            type: String,
            require: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const RECORD = MONGOOSE.model('record', recordSchema)

module.exports = RECORD