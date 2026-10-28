const mongoose = require('mongoose')

const authSchema = mongoose.Schema({
    name: {type: String, required: [true, "User name is required"], trim: true},
    email: {type: String, required: [true, "User name is required"], unique: true, trim: true, lowercase: true},
    password: {type: String, required: [true, "User password is required"], trim: true}
})

module.exports = mongoose.model('Auth', authSchema) 