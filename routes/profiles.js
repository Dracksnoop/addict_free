const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const ProfileData = require('../models/ProfileData');

// Get all profiles
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().sort({ createdAt: -1 });
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single profile
router.get('/:profileId', async (req, res) => {
    try {
        const profile = await Profile.findOne({ profileId: req.params.profileId });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new profile
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Profile name is required' });
        }

        // Check if profile with same name already exists
        const existingProfile = await Profile.findOne({ 
            name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } 
        });

        if (existingProfile) {
            return res.status(400).json({ error: 'Profile with this name already exists' });
        }

        const profileId = 'profile_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const profile = new Profile({
            profileId,
            name: name.trim(),
            createdAt: new Date(),
            lastAccessed: new Date()
        });

        await profile.save();

        // Create default data for this profile
        const profileData = new ProfileData({
            profileId,
            startDate: new Date(),
            checkIns: [],
            cravings: [],
            goals: [],
            milestones: [],
            achievements: []
        });

        await profileData.save();

        res.status(201).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update profile
router.put('/:profileId', async (req, res) => {
    try {
        const { name } = req.body;
        const profile = await Profile.findOne({ profileId: req.params.profileId });

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        if (name && name.trim() !== '') {
            profile.name = name.trim();
        }

        profile.lastAccessed = new Date();
        await profile.save();

        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete profile
router.delete('/:profileId', async (req, res) => {
    try {
        const profile = await Profile.findOne({ profileId: req.params.profileId });

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        // Delete profile and its data
        await Profile.deleteOne({ profileId: req.params.profileId });
        await ProfileData.deleteOne({ profileId: req.params.profileId });

        res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

