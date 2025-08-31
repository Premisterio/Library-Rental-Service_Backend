const express = require('express');
const router = express.Router();
const { authenticateToken, requireLibrarian, requireOwnershipOrLibrarian } = require('../middleware/auth');
const {
    getAllReaders,
    getReaderById,
    createReader,
    updateReader,
    deleteReader,
    searchReaders,
    getReadersByCategory
} = require('../controllers/readerController');

router.get('/', authenticateToken, requireLibrarian, getAllReaders);
router.get('/search', authenticateToken, requireLibrarian, searchReaders);
router.get('/category/:category', authenticateToken, requireLibrarian, getReadersByCategory);
router.get('/:id', authenticateToken, requireOwnershipOrLibrarian('id'), getReaderById);

router.post('/', authenticateToken, requireLibrarian, createReader);
router.put('/:id', authenticateToken, requireOwnershipOrLibrarian('id'), updateReader);
router.delete('/:id', authenticateToken, requireLibrarian, deleteReader);

module.exports = router;