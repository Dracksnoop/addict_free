const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    profileId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastAccessed: {
        type: Date,
        default: Date.now
    }
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;

