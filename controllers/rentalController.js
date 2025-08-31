const Rental = require('../models/Rental');
const Book = require('../models/Book');
const Reader = require('../models/Reader');
const { asyncHandler } = require('../middleware/errorHandler');
const createError = require('http-errors');

const getAllRentals = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status, reader, book } = req.query;
    
    const query = {};
    
    if (status) {
        query.status = status;
    }
    
    if (reader) {
        query.reader = reader;
    }
    
    if (book) {
        query.book = book;
    }
    
    const skip = (page - 1) * limit;
    
    const rentals = await Rental.find(query)
        .populate('book', 'title author genre')
        .populate('reader', 'firstName lastName phone')
        .sort({ issueDate: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    
    const total = await Rental.countDocuments(query);
    
    res.json({
        success: true,
        data: {
            rentals,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        }
    });
});

const getRentalById = asyncHandler(async (req, res) => {
    const rental = await Rental.findById(req.params.id)
        .populate('book')
        .populate('reader');
    
    if (!rental) {
        throw createError(404, 'Rental not found');
    }
    
    res.json({
        success: true,
        data: { rental }
    });
});

const createRental = asyncHandler(async (req, res) => {
    const { bookId, readerId, expectedReturnDate } = req.body;
    
    const book = await Book.findById(bookId);
    if (!book || !book.isActive) {
        throw createError(404, 'Book not found');
    }
    
    if (!book.isAvailable) {
        throw createError(400, 'Book is not available for rental');
    }
    
    const reader = await Reader.findById(readerId);
    if (!reader || !reader.isActive) {
        throw createError(404, 'Reader not found');
    }
    
    const activeRentals = await Rental.countDocuments({ 
        reader: readerId, 
        status: 'active' 
    });
    
    if (activeRentals >= 3) {
        throw createError(400, 'Reader has reached maximum rental limit (3 books)');
    }
    
    // Creates a new rental record, calculating the discount based on:
    // 1. Rental duration (days between today and expected return) rentalPricePerDay - (rentalPricePerDay * duration)
    // 2. Base cost (daily rate × duration)
    // 3. Reader-specific discount applied to base cost 
    // 4. Final discount amount (base cost - discounted cost)
    const rental = new Rental({
        book: bookId,
        reader: readerId,
        issueDate: new Date(),
        expectedReturnDate: new Date(expectedReturnDate),
        depositAmount: book.depositAmount,
        rentalPricePerDay: book.rentalPricePerDay,
        discountAmount: reader.calculateDiscountedPrice(book.rentalPricePerDay * Math.ceil((new Date(expectedReturnDate) - new Date()) / (1000 * 60 * 60 * 24))) - (book.rentalPricePerDay * Math.ceil((new Date(expectedReturnDate) - new Date()) / (1000 * 60 * 60 * 24)))
    });
    
    await rental.save();
    await book.rentCopy();
    
    await rental.populate('book', 'title author');
    await rental.populate('reader', 'firstName lastName');
    
    res.status(201).json({
        success: true,
        message: 'Rental created successfully',
        data: { rental }
    });
});

const returnBook = asyncHandler(async (req, res) => {
    const { fineAmount = 0, notes } = req.body;
    
    const rental = await Rental.findById(req.params.id)
        .populate('book')
        .populate('reader');
    
    if (!rental) {
        throw createError(404, 'Rental not found');
    }
    
    if (rental.status === 'returned') {
        throw createError(400, 'Book has already been returned');
    }
    
    await rental.returnBook(fineAmount, notes);
    await rental.book.returnCopy();
    
    res.json({
        success: true,
        message: 'Book returned successfully',
        data: { rental }
    });
});

const getActiveRentals = asyncHandler(async (req, res) => {
    const rentals = await Rental.findActive();
    
    res.json({
        success: true,
        data: { rentals }
    });
});

const getOverdueRentals = asyncHandler(async (req, res) => {
    const rentals = await Rental.findOverdue();
    
    res.json({
        success: true,
        data: { rentals }
    });
});

const getReaderRentals = asyncHandler(async (req, res) => {
    const { readerId } = req.params;
    const { status = 'all' } = req.query;
    
    const query = { reader: readerId };
    
    if (status !== 'all') {
        query.status = status;
    }
    
    const rentals = await Rental.find(query)
        .populate('book', 'title author genre')
        .sort({ issueDate: -1 });
    
    res.json({
        success: true,
        data: { rentals }
    });
});

const getRentalStats = asyncHandler(async (req, res) => {
    const stats = await Promise.all([
        Rental.countDocuments({ status: 'active' }),
        Rental.countDocuments({ status: 'overdue' }),
        Rental.countDocuments({ status: 'returned' }),
        Rental.aggregate([
            { $match: { status: 'returned' } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
        ])
    ]);
    
    res.json({
        success: true,
        data: {
            activeRentals: stats[0],
            overdueRentals: stats[1],
            completedRentals: stats[2],
            totalRevenue: stats[3][0]?.totalRevenue || 0
        }
    });
});

module.exports = {
    getAllRentals,
    getRentalById,
    createRental,
    returnBook,
    getActiveRentals,
    getOverdueRentals,
    getReaderRentals,
    getRentalStats
};