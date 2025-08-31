const mongoose = require('mongoose');

const readerSchema = new mongoose.Schema({
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    middleName: {
        type: String,
        trim: true,
        maxlength: 50
    },
    address: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        sparse: true
    },
    category: {
        type: String,
        enum: ['regular', 'student', 'senior', 'employee'],
        default: 'regular'
    },
    discountPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

readerSchema.pre('save', function(next) {
    switch(this.category) {
        case 'student':
            this.discountPercentage = 15;
            break;
        case 'senior':
            this.discountPercentage = 20;
            break;
        case 'employee':
            this.discountPercentage = 10;
            break;
        default:
            this.discountPercentage = 0;
    }
    next();
});

readerSchema.index({ lastName: 1, firstName: 1 });
readerSchema.index({ phone: 1 }, { unique: true });
readerSchema.index({ email: 1 }, { unique: true, sparse: true });

readerSchema.virtual('fullName').get(function() {
    if (this.middleName) {
        return `${this.lastName} ${this.firstName} ${this.middleName}`;
    }
    return `${this.lastName} ${this.firstName}`;
});

readerSchema.methods.calculateDiscountedPrice = function(originalPrice) {
    const discountAmount = (originalPrice * this.discountPercentage) / 100;
    return Math.max(0, originalPrice - discountAmount);
};

readerSchema.statics.findByName = function(searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    return this.find({
        $or: [
            { firstName: regex },
            { lastName: regex },
            { middleName: regex }
        ],
        isActive: true
    });
};

module.exports = mongoose.model('Reader', readerSchema);