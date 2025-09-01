const Reader = require('../models/Reader');
const { asyncHandler } = require('../middleware/errorHandler');
const createError = require('http-errors');

const getAllReaders = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search, category } = req.query;
    
    const query = { isActive: true };
    
    if (search) {
        query.$or = [
            { firstName: new RegExp(search, 'i') },
            { lastName: new RegExp(search, 'i') },
            { phone: new RegExp(search, 'i') },
            { email: new RegExp(search, 'i') }
        ];
    }
    
    if (category) {
        query.category = category;
    }
    
    const skip = (page - 1) * limit;
    
    const readers = await Reader.find(query)
        .sort({ lastName: 1, firstName: 1 })
        .skip(skip)
        .limit(parseInt(limit));
    
    const total = await Reader.countDocuments(query);
    
    res.json({
        success: true,
        data: {
            readers,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        }
    });
});

const getReaderById = asyncHandler(async (req, res) => {
    const reader = await Reader.findById(req.params.id);
    
    if (!reader || !reader.isActive) {
        throw createError(404, 'Reader not found');
    }
    
    res.json({
        success: true,
        data: { reader }
    });
});

const createReader = asyncHandler(async (req, res) => {
    const { lastName, firstName, middleName, address, phone, email, category } = req.body;
    
    const existingReader = await Reader.findOne({ phone });
    if (existingReader) {
        throw createError(409, 'Reader with this phone number already exists');
    }
    
    if (email) {
        const existingEmail = await Reader.findOne({ email });
        if (existingEmail) {
            throw createError(409, 'Reader with this email already exists');
        }
    }
    
    const reader = new Reader({
        lastName,
        firstName,
        middleName,
        address,
        phone,
        email,
        category
    });
    
    await reader.save();
    
    res.status(201).json({
        success: true,
        message: 'Reader created successfully',
        data: { reader }
    });
});

const updateReader = asyncHandler(async (req, res) => {
    const reader = await Reader.findById(req.params.id);
    
    if (!reader) {
        throw createError(404, 'Reader not found');
    }
    
    const { phone, email } = req.body;
    
    // Check for unique constraints before updating
    if (phone && phone !== reader.phone) {
        const existingPhone = await Reader.findOne({ phone });
        if (existingPhone) {
            throw createError(409, 'Reader with this phone number already exists');
        }
    }
    
    if (email && email !== reader.email) {
        const existingEmail = await Reader.findOne({ email });
        if (existingEmail) {
            throw createError(409, 'Reader with this email already exists');
        }
    }

    // Build an update object that only includes defined values
    const updates = {};
    const fields = [
        "lastName", 
        "firstName", 
        "middleName", 
        "address", 
        "phone", 
        "email", 
        "category", 
        "isActive"
    ];
    
    fields.forEach(field => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });
    
    // Apply updates
    Object.assign(reader, updates);
    await reader.save();
    
    res.json({
        success: true,
        message: 'Reader updated successfully',
        data: { reader }
    });
});

const deleteReader = asyncHandler(async (req, res) => {
    const reader = await Reader.findById(req.params.id);
    
    if (!reader) {
        throw createError(404, 'Reader not found');
    }
    
    reader.isActive = false;
    await reader.save();
    
    res.json({
        success: true,
        message: 'Reader deleted successfully'
    });
});

const searchReaders = asyncHandler(async (req, res) => {
    const { q } = req.query;
    
    if (!q) {
        throw createError(400, 'Search query is required');
    }
    
    const readers = await Reader.findByName(q);
    
    res.json({
        success: true,
        data: { readers }
    });
});

const getReadersByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;
    
    const readers = await Reader.find({ 
        category, 
        isActive: true 
    }).sort({ lastName: 1, firstName: 1 });
    
    res.json({
        success: true,
        data: { readers }
    });
});

module.exports = {
    getAllReaders,
    getReaderById,
    createReader,
    updateReader,
    deleteReader,
    searchReaders,
    getReadersByCategory
};