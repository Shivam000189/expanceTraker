const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/expance";

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

module.exports = mongoose;
