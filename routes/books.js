const express = require('express');
const router = express.Router();
const { authenticateToken, requireLibrarian } = require('../middleware/auth');
const {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getAvailableBooks,
    getBooksByGenre
} = require('../controllers/bookController');

router.get('/', getAllBooks);
router.get('/available', getAvailableBooks);
router.get('/genre/:genre', getBooksByGenre);
router.get('/:id', getBookById);

router.post('/', authenticateToken, requireLibrarian, createBook);
router.put('/:id', authenticateToken, requireLibrarian, updateBook);
router.delete('/:id', authenticateToken, requireLibrarian, deleteBook);

module.exports = router;