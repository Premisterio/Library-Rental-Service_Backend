const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('MONGODB_URI is not defined in .env file!');
        }

        console.log('Connecting to MongoDB...');
        
        // DB connection
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');
        
        // Error
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        // Disconnect
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;