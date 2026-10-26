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
        const books = await bookModel.find({
            owner: req.user._id
        }).sort({
            createdAt: -1
        })
        if(books.length === 0){
            return res.status(404).json({
                error: "No book found."
            })
        }
        return res.status(200).json({
            message: "All books fetched successfully.",
            data: books
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
        let putDescription = book.description
        let coverImageUrl = book.coverImage
        const {title, author, description} = req.body
        if(!title || !author){
            return res.status(400).json({
                error: "Please fill required fields."
            })
        }
        if(description){
            putDescription = description
        }
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path)
            coverImageUrl = result.secure_url
        }
        book.title = title
        book.author = author
        book.description = putDescription
        book.coverImage = coverImageUrl
        await book.save()

        return res.status(200).json({
            message: "Book updated successfully.",
            data: book
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