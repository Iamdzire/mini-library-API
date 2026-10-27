const readingListModel = require('../models/readingListModel')
const bookModel = require('../models/bookModel')

const createReadingList = async (req, res) => {
    try {
        let putName = ""
        let putBook = []
        const { name, books } = req.body
        if (name) {
            putName = name
        }
        if (books) {
            const booksArray = Array.isArray(books) ? books : [books]
            for (const id of booksArray) {
                const book = await bookModel.findById(id)
                if (!book) {
                    return res.status(404).json({
                        error: "Book not found."
                    })
                }
                if (req.user._id.toString() !== book.owner.toString()) {
                    return res.status(403).json({
                        error: "User not authorized."
                    })
                }
                putBook = book._id
            }
        }
        const newReadingList = new readingListModel({
            name: putName,
            owner: req.user._id,
            books: putBook
        })
        await newReadingList.save()

        return res.status(201).json({
            message: "Reading list created successfully.",
            data: newReadingList
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}


const getAllReadingListsByOwner = async (req, res) => {
    try {
        const readingLists = await readingListModel
  .find({ owner: req.user._id })
  .sort({ createdAt: -1 })
  .populate('books');

        if (readingLists.length === 0) {
            return res.status(404).json({
                error: "No reading list found."
            })
        }
        return res.status(200).json({
            message: "Reading lists fetched successfully.",
            data: readingLists
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}


const getSingleReadingListByOwner = async (req, res) => {
    try {
        const { id } = req.params
        const readingList = await readingListModel.findById(id).populate('books')
        if (!readingList) {
            return res.status(404).json({
                error: "Reading list not found."
            })
        }
        if (req.user._id.toString() !== readingList.owner.toString()) {
            return res.status(403).json({
                error: "User not authorized."
            })
        }
        return res.status(200).json({
            message: "Reading list fetched successfully.",
            data: readingList
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}


const updateReadingListByOwner = async (req, res) => {
    try {
        const { id } = req.params
        const readingList = await readingListModel.findById(id)
        if (!readingList) {
            return res.status(404).json({
                error: "Reading list not found."
            })
        }
        if (req.user._id.toString() !== readingList.owner.toString()) {
            return res.status(403).json({
                error: "User not authorized."
            })
        }
        let putName = readingList.name
        let putBook = readingList.books
        const { name, books } = req.body
        if (name) {
            putName = name
        }
        if (books) {
            // Ensure 'books' is handled as an array, even if a single string is passed
            const booksArray = Array.isArray(books) ? books : [books]
            // Verify if the books exist in your database
            for (const id of booksArray) {
                const book = await bookModel.findById(id)
                if (!book) {
                    return res.status(404).json({
                        error: "Book not found."
                    })
                }
                if (req.user._id.toString() !== book.owner.toString()) {
                    return res.status(403).json({
                        error: "User not authorized."
                    })
                }
                // Use .includes() to prevent adding duplicate books to the list
                if (putBook.some(id => id.toString() !== book._id.toString())) {
                    await putBook.push(book._id)
                } else {
                    return res.status(400).json({
                        error: "Book already exists."
                    })
                }
            }
        }
        readingList.name = putName
        readingList.books = putBook
        const updatedReadingList = await readingList.save()

        return res.status(200).json({
            message: "Reading list updated successfully.",
            data: updatedReadingList
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}


const deleteReadingListByOwner = async (req, res) => {
    try {
        const { id } = req.params
        const readingList = await readingListModel.findById(id)
        if (!readingList) {
            return res.status(404).json({
                error: "Reading list not found."
            })
        }
        if (req.user._id.toString() !== readingList.owner.toString()) {
            return res.status(403).json({
                error: "User not authorized."
            })
        }
        await readingListModel.findByIdAndDelete(id)
        return res.status(200).json({
            message: "Reading list deleted successfully.",
            data: readingList
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}


const addBookToReadingListByOwner = async (req, res) => {
    try {
        const { id } = req.params
        const readingList = await readingListModel.findById(id)
        if (!readingList) {
            return res.status(404).json({
                error: "Reading list not found"
            })
        }
        if (req.user._id.toString() !== readingList.owner.toString()) {
            return res.status(403).json({
                error: "User not authorized."
            })
        }
        const { books } = req.body
        if (!books) {
            return res.status(400).json({
                error: "Please fill the required fields."
            })
        }
        const booksArray = Array.isArray(books) ? books : [books]
            // Verify if the books exist in your database
            for (const id of booksArray) {
                const book = await bookModel.findById(id)
                if (!book) {
                    return res.status(404).json({
                        error: "Book not found."
                    })
                }
                if (req.user._id.toString() !== book.owner.toString()) {
                    return res.status(403).json({
                        error: "User not authorized."
                    })
                }
                // Use .includes() to prevent adding duplicate books to the list
                if (readingList.books.some(id => id.toString() !== book._id.toString())) {
                    await readingList.books.push(book._id)
                } else {
                    return res.status(400).json({
                        error: "Book already exists."
                    })
                }
            }

        await readingList.save()

        return res.status(200).json({
            message: "Successfully added book to reading list.",
            data: readingList
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

module.exports = {
    createReadingList, getAllReadingListsByOwner, getSingleReadingListByOwner, updateReadingListByOwner, deleteReadingListByOwner, addBookToReadingListByOwner
}