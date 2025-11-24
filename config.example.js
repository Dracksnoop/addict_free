// Copy this file to config.js and update with your MongoDB connection
// Rename this file to: config.js

module.exports = {
    // MongoDB Connection String
    // For local MongoDB: mongodb://localhost:27017/addiction-free
    // For MongoDB Atlas (cloud): mongodb+srv://username:password@cluster.mongodb.net/addiction-free
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/addiction-free',
    
    // Server Port
    PORT: process.env.PORT || 3000
};

