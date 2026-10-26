const express = require('express')
const requireAuth = require('../middlewares/authMiddleware')
const {
    createReadingList, getAllReadingListsByOwner, getSingleReadingListByOwner, updateReadingListByOwner, deleteReadingListByOwner, addBookToReadingListByOwner
} = require('../controllers/readingListController')

const router = express.Router()

router.post('/', requireAuth, createReadingList)
router.get('/', requireAuth, getAllReadingListsByOwner)
router.get('/:id', requireAuth, getSingleReadingListByOwner)
router.put('/:id', requireAuth, updateReadingListByOwner)
router.delete('/:id', requireAuth, deleteReadingListByOwner)
router.post('/:id/books', requireAuth, addBookToReadingListByOwner)

module.exports = router