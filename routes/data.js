const express = require('express');
const router = express.Router();
const ProfileData = require('../models/ProfileData');
const Profile = require('../models/Profile');

// Get profile data
router.get('/:profileId', async (req, res) => {
    try {
        let profileData = await ProfileData.findOne({ profileId: req.params.profileId });

        // If no data exists, create default data
        if (!profileData) {
            profileData = new ProfileData({
                profileId: req.params.profileId,
                startDate: new Date(),
                checkIns: [],
                cravings: [],
                goals: [],
                milestones: [],
                achievements: []
            });
            await profileData.save();
        }

        // Update profile last accessed
        await Profile.findOneAndUpdate(
            { profileId: req.params.profileId },
            { lastAccessed: new Date() }
        );

        res.json(profileData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update profile data
router.put('/:profileId', async (req, res) => {
    try {
        const { data } = req.body;

        if (!data) {
            return res.status(400).json({ error: 'Data is required' });
        }

        let profileData = await ProfileData.findOne({ profileId: req.params.profileId });

        if (!profileData) {
            // Create new data if doesn't exist
            profileData = new ProfileData({
                profileId: req.params.profileId,
                ...data
            });
        } else {
            // Update existing data
            profileData.startDate = data.startDate || profileData.startDate;
            profileData.lastCheckIn = data.lastCheckIn || profileData.lastCheckIn;
            profileData.checkIns = data.checkIns || profileData.checkIns;
            profileData.cravings = data.cravings || profileData.cravings;
            profileData.goals = data.goals || profileData.goals;
            profileData.milestones = data.milestones || profileData.milestones;
            profileData.achievements = data.achievements || profileData.achievements;
        }

        await profileData.save();

        // Update profile last accessed
        await Profile.findOneAndUpdate(
            { profileId: req.params.profileId },
            { lastAccessed: new Date() }
        );

        res.json(profileData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add check-in
router.post('/:profileId/checkin', async (req, res) => {
    try {
        const checkIn = req.body;
        let profileData = await ProfileData.findOne({ profileId: req.params.profileId });

        if (!profileData) {
            profileData = new ProfileData({
                profileId: req.params.profileId,
                startDate: new Date(),
                checkIns: [],
                cravings: [],
                goals: [],
                milestones: [],
                achievements: []
            });
        }

        // Remove existing check-in for today if exists
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        profileData.checkIns = profileData.checkIns.filter(c => {
            const checkInDate = new Date(c.date);
            checkInDate.setHours(0, 0, 0, 0);
            return checkInDate.getTime() !== today.getTime();
        });

        profileData.checkIns.push({
            date: new Date(),
            ...checkIn
        });

        profileData.lastCheckIn = new Date();
        await profileData.save();

        res.json(profileData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add craving
router.post('/:profileId/craving', async (req, res) => {
    try {
        const craving = req.body;
        let profileData = await ProfileData.findOne({ profileId: req.params.profileId });

        if (!profileData) {
            profileData = new ProfileData({
                profileId: req.params.profileId,
                startDate: new Date(),
                checkIns: [],
                cravings: [],
                goals: [],
                milestones: [],
                achievements: []
            });
        }

        profileData.cravings.push({
            date: new Date(),
            ...craving
        });

        await profileData.save();
        res.json(profileData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

