const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    author: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    genre: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    depositAmount: {
        type: Number,
        required: true,
        min: 0
    },
    rentalPricePerDay: {
        type: Number,
        required: true,
        min: 0
    },
    availableCopies: {
        type: Number,
        required: true,
        min: 0,
        default: 1
    },
    totalCopies: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// availableCopies !> totalCopies
bookSchema.pre('save', function(next) {
    if (this.availableCopies > this.totalCopies) {
        return next(new Error('Available copies cannot exceed total copies'));
    }
    next();
});

bookSchema.virtual('isAvailable').get(function() {
    return this.isActive && this.availableCopies > 0;
});

bookSchema.methods.rentCopy = function() {
    if (!this.isAvailable) throw new Error('No copies available');
    this.availableCopies -= 1;
    return this.save();
};

bookSchema.methods.returnCopy = function() {
    if (this.availableCopies >= this.totalCopies) throw new Error('Cannot return more copies than total');
    this.availableCopies += 1;
    return this.save();
};

bookSchema.statics.findAvailable = function() {
    return this.find({ availableCopies: { $gt: 0 }, isActive: true });
};

bookSchema.index({ title: 1, author: 1 });
bookSchema.index({ genre: 1 });

module.exports = mongoose.model('Book', bookSchema);