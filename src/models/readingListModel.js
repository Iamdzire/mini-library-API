const mongoose = require('mongoose')

const readingListSchema = mongoose.Schema({
    name: {type: String, trim : true},
    owner: {type: mongoose.Schema.Types.ObjectId, required: [true, "Reading list owner is required"], ref: "Auth"},
    books: [{type: mongoose.Schema.Types.ObjectId, ref: "Book"}]
}, {timestamps: true})

module.exports = mongoose.model('ReadingList', readingListSchema) 