const express = require('express');
const jwt = require('jsonwebtoken');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();

// Middleware to verify token
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ msg: 'No token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Invalid token' });
    }
};

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get event details by ID
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Register for event (authenticated)
router.post('/register/:eventId', authMiddleware, async (req, res) => {
    try {
        const existing = await Registration.findOne({ user: req.userId, event: req.params.eventId });
        if (existing) return res.status(400).json({ msg: 'Already registered' });

        const registration = new Registration({ user: req.userId, event: req.params.eventId });
        await registration.save();
        res.json({ msg: 'Registered successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// View user registrations (authenticated)
router.get('/my-registrations', authMiddleware, async (req, res) => {
    try {
        const registrations = await Registration.find({ user: req.userId }).populate('event');
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Cancel registration (authenticated)
router.delete('/cancel/:registrationId', authMiddleware, async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.registrationId);
        if (!registration || registration.user.toString() !== req.userId) {
            return res.status(404).json({ msg: 'Registration not found' });
        }
        await registration.deleteOne();
        res.json({ msg: 'Cancelled successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;