const express = require('express');
const router = express.Router();
const { authenticateToken, requireLibrarian, requireOwnershipOrLibrarian } = require('../middleware/auth');
const {
    getAllRentals,
    getRentalById,
    createRental,
    returnBook,
    getActiveRentals,
    getOverdueRentals,
    getReaderRentals,
    getRentalStats
} = require('../controllers/rentalController');

router.get('/', authenticateToken, requireLibrarian, getAllRentals);
router.get('/active', authenticateToken, requireLibrarian, getActiveRentals);
router.get('/overdue', authenticateToken, requireLibrarian, getOverdueRentals);
router.get('/stats', authenticateToken, requireLibrarian, getRentalStats);
router.get('/reader/:readerId', authenticateToken, requireOwnershipOrLibrarian('readerId'), getReaderRentals);
router.get('/:id', authenticateToken, requireLibrarian, getRentalById);

router.post('/', authenticateToken, requireLibrarian, createRental);
router.put('/:id/return', authenticateToken, requireLibrarian, returnBook);

module.exports = router;