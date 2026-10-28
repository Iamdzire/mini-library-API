const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
    title: {type: String, required: [true, "Book title is required"], trim: true},
    author: {type: String, required: [true, "Book author is required"], trim: true},
    description: {type: String, trim: true},
    coverImage: {type: String, trim: true},
    owner: {type: mongoose.Schema.Types.ObjectId, required: [true, "Book owner is required"], ref: 'Auth'}
}, {timestamps: true})

module.exports = mongoose.model('Book', bookSchema) 