const Book = require('../models/Book');
const { asyncHandler } = require('../middleware/errorHandler');
const createError = require('http-errors');

const getAllBooks = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, genre, author, search, available } = req.query;
    
    const query = { isActive: true };
    
    if (genre) {
        query.genre = new RegExp(genre, 'i');
    }
    
    if (author) {
        query.author = new RegExp(author, 'i');
    }
    
    if (search) {
        query.$or = [
            { title: new RegExp(search, 'i') },
            { author: new RegExp(search, 'i') }
        ];
    }
    
    if (available === 'true') {
        query.availableCopies = { $gt: 0 };
    }
    
    const skip = (page - 1) * limit;
    
    const books = await Book.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    
    const total = await Book.countDocuments(query);
    
    res.json({
        success: true,
        data: {
            books,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        }
    });
});

const getBookById = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    
    if (!book || !book.isActive) {
        throw createError(404, 'Book not found');
    }
    
    res.json({
        success: true,
        data: { book }
    });
});

const createBook = asyncHandler(async (req, res) => {
    const { title, author, genre, depositAmount, rentalPricePerDay, totalCopies } = req.body;
    
    const existingBook = await Book.findOne({ title, author });
    if (existingBook) {
        throw createError(409, 'Book with this title and author already exists');
    }
    
    const book = new Book({
        title,
        author,
        genre,
        depositAmount,
        rentalPricePerDay,
        totalCopies,
        availableCopies: totalCopies
    });
    
    await book.save();
    
    res.status(201).json({
        success: true,
        message: 'Book created successfully',
        data: { book }
    });
});

const updateBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
        throw createError(404, 'Book not found');
    }
    
    // Build an update object that only includes defined values
    const updates = {};
    const fields = [
        "title", 
        "author", 
        "genre", 
        "depositAmount", 
        "rentalPricePerDay", 
        "totalCopies", 
        "availableCopies", 
        "isActive"
    ];
    
    fields.forEach(field => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });
    
    // Apply updates
    Object.assign(book, updates);
    await book.save();
    
    res.json({
        success: true,
        message: 'Book updated successfully',
        data: { book }
    });
});

const deleteBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
        throw createError(404, 'Book not found');
    }
    
    book.isActive = false;
    await book.save();
    
    res.json({
        success: true,
        message: 'Book deleted successfully'
    });
});

const getAvailableBooks = asyncHandler(async (req, res) => {
    const books = await Book.findAvailable();
    
    res.json({
        success: true,
        data: { books }
    });
});

const getBooksByGenre = asyncHandler(async (req, res) => {
    const { genre } = req.params;
    
    const books = await Book.find({ 
        genre: new RegExp(genre, 'i'), 
        isActive: true 
    }).sort({ title: 1 });
    
    res.json({
        success: true,
        data: { books }
    });
});

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getAvailableBooks,
    getBooksByGenre
};