const bookModel = require('../models/bookModel')
const cloudinary = require('../config/cloudinary')

const createBook = async (req, res) => {
    try {
        let putDescription = ""
        let coverImageUrl = ""
        const {title, author, description} = req.body
        if(!title || !author){
            return res.status(400).json({
                error: "Please fill all required fields."
            })
        }
        if(description){
            putDescription = description
        }
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path)
            coverImageUrl = result.secure_url
        }
        const newBook = new bookModel({
            title,
            author,
            description: putDescription,
            coverImage: coverImageUrl,
            owner: req.user._id
        })
        await newBook.save()

        return res.status(201).json({
            message: "Book created successfully.",
            data: newBook
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })
    }
}


const getAllBooksByOwner = async (req, res) => { 
    try {
        let sortOption = {createdAt: -1} // Default: Newest first
        const {page, limit, title, author, sort} = req.query
        const pageNumber = Number(page) || 1
        const limitNumber = Number(limit) || 4
        const skip = (pageNumber - 1) * limitNumber
        const filter = {owner: req.user._id}

        if(title){
            filter.title = {$regex: title, $options: 'i'}
        }
        if(author){
            filter.author = {$regex: author, $options: 'i'}
        }
        if(sort === 'oldest'){
            sortOption = {createdAt: 1}
        }
        if(sort === 'title'){
            sortOption = {title: 1}
        }
        if(sort === 'author'){
            sortOption = {author: 1}
        }
        const books = await bookModel
        .find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber)
        if(books.length === 0){
            return res.status(404).json({
                error: "No book found."
            })
        }
        const total = await bookModel.countDocuments(filter)
        const totalPages = Math.ceil(total / limitNumber)

        return res.status(200).json({
            message: "All books fetched successfully.",
            data: {
                books,
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages
            }
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })
    }
}


const getSingleBookByOwner = async (req, res) => {
    try {
        const {id} = req.params
        const book = await bookModel.findById(id)
        if(!book){
            return res.status(404).json({
                erroe: "Book not found."
            })
        }
        if(req.user._id.toString() !== book.owner.toString()){
            return res.status(403).json({
                error: "User not authorized."
            })
        }
        return res.status(200).json({
            message: "Book fetched successfully.",
            data: book
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })
    }
}


const updateBookByOwner = async (req, res) => {
    try {
        const {id} = req.params
        const book = await bookModel.findById(id)
        if(!book){
            return res.status(404).json({
                error: "Book not found."
            })
        }
        if(req.user._id.toString() !== book.owner.toString()){
            return res.status(403).json({
                error: "User not authorized."
            })
        }
        let putTitle = book.title
        let putAuthor = book.author
        let putDescription = book.description
        let coverImageUrl = book.coverImage
        const {title, author, description} = req.body
        if(title){
            putTitle = title
        }
        if(author){
            putAuthor = author
        }
        if(description){
            putDescription = description
        }
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path)
            coverImageUrl = result.secure_url
        }
        book.title = putTitle
        book.author = putAuthor
        book.description = putDescription
        book.coverImage = coverImageUrl
        const updatedBook = await book.save()

        return res.status(200).json({
            message: "Book updated successfully.",
            data: updatedBook
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })
    }
}


const deleteBookByOwner = async (req, res) => {
    try {
        const {id} = req.params
        const book = await bookModel.findById(id)
        if(!book){
            return res.status(404).json({
                error: "Book not found."
            })
        }
        if(req.user._id.toString() !== book.owner.toString()){
            return res.status(403).json({
                error: "User not authorised."
            })
        }
        await bookModel.findByIdAndDelete(id)

        return res.status(200).json({
            message: "Book deleted successfully.",
            data: book
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })
    }
}

module.exports = {
    createBook, getAllBooksByOwner, getSingleBookByOwner, updateBookByOwner, deleteBookByOwner
}