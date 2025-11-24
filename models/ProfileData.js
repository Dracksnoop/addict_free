const mongoose = require('mongoose');

const profileDataSchema = new mongoose.Schema({
    profileId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    lastCheckIn: {
        type: Date,
        default: null
    },
    checkIns: [{
        date: Date,
        mood: String,
        cravings: String,
        energyLevel: Number,
        gratitude: String,
        notes: String
    }],
    cravings: [{
        date: Date,
        intensity: Number,
        trigger: String,
        copingStrategy: String,
        notes: String
    }],
    goals: [{
        id: Number,
        name: String,
        targetDays: Number,
        createdAt: Date,
        achieved: Boolean
    }],
    milestones: [Number],
    achievements: [String],
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Update updatedAt on save
profileDataSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const ProfileData = mongoose.model('ProfileData', profileDataSchema);

module.exports = ProfileData;

