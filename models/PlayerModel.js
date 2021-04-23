const mongoose = require('mongoose')

const PLayerSchema = mongoose.Schema({
    _id: Number,
    name: String,
    age: Number
})

module.exports = mongoose.model('Players',PlayerSchema)