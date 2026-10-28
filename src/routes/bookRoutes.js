const express = require('express')
const upload = require('../config/multer')
const {
    createBook, getAllBooksByOwner, getSingleBookByOwner, updateBookByOwner, deleteBookByOwner
} = require('../controllers/bookController')
const requireAuth = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/', requireAuth, upload.single('coverImage'), createBook)
router.get('/', requireAuth, getAllBooksByOwner)
router.get('/:id', requireAuth, getSingleBookByOwner)
router.put('/:id', requireAuth, upload.single('coverImage'), updateBookByOwner)
router.delete('/:id', requireAuth, deleteBookByOwner)

module.exports = router 