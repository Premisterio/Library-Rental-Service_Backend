const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    reader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reader',
        required: true
    },
    issueDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    expectedReturnDate: {
        type: Date,
        required: true
    },
    actualReturnDate: {
        type: Date
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
    fineAmount: {
        type: Number,
        min: 0,
        default: 0
    },
    discountAmount: {
        type: Number,
        min: 0,
        default: 0
    },
    totalAmount: {
        type: Number,
        min: 0,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'returned', 'overdue'],
        default: 'active'
    },
    notes: {
        type: String,
        maxlength: 500,
        trim: true
    }
}, { timestamps: true });

// Calculate total amount + update status
rentalSchema.pre('save', function(next) {
    const endDate = this.actualReturnDate || new Date();
    const rentalDays = Math.max(1, Math.ceil((endDate - this.issueDate) / (1000 * 60 * 60 * 24)));
    
    this.totalAmount = (this.rentalPricePerDay * rentalDays) + this.fineAmount - this.discountAmount;
    
    if (this.actualReturnDate) {
        this.status = 'returned';
    } else if (new Date() > this.expectedReturnDate) {
        this.status = 'overdue';
    }
    
    next();
});

rentalSchema.virtual('isOverdue').get(function() {
    return !this.actualReturnDate && new Date() > this.expectedReturnDate;
});

rentalSchema.virtual('rentalDays').get(function() {
    const endDate = this.actualReturnDate || new Date();
    return Math.ceil((endDate - this.issueDate) / (1000 * 60 * 60 * 24));
});

rentalSchema.methods.returnBook = function(fineAmount = 0, notes = '') {
    this.actualReturnDate = new Date();
    this.fineAmount = fineAmount;
    this.status = 'returned';
    if (notes) this.notes = notes;
    return this.save();
};

rentalSchema.statics.findActive = function() {
    return this.find({ status: 'active' })
                .populate('book', 'title author')
                .populate('reader', 'firstName lastName');
};

rentalSchema.statics.findOverdue = function() {
    return this.find({ status: 'overdue' })
                .populate('book', 'title author')
                .populate('reader', 'firstName lastName phone');
};

rentalSchema.index({ reader: 1, issueDate: -1 });
rentalSchema.index({ book: 1, issueDate: -1 });
rentalSchema.index({ status: 1 });

module.exports = mongoose.model('Rental', rentalSchema);