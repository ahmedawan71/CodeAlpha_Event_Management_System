const express = require('express');
const jwt = require('jsonwebtoken');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.error('Token verification error:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (err) {
        console.error('Error fetching events:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });
        res.json(event);
    } catch (err) {
        console.error('Error fetching event:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

router.post('/:eventId/register', authMiddleware, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        const existing = await Registration.findOne({ 
            user: req.userId, 
            event: eventId 
        });
        if (existing) {
            return res.status(400).json({ msg: 'Already registered for this event' });
        }

        const registration = new Registration({ 
            user: req.userId, 
            event: eventId 
        });
        await registration.save();
        
        res.json({ msg: 'Successfully registered for event', registrationId: registration._id });
    } catch (err) {
        console.error('Error registering for event:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

router.get('/registrations/my', authMiddleware, async (req, res) => {
    try {
        const registrations = await Registration.find({ user: req.userId })
            .populate('event', 'title description date')
            .sort({ createdAt: -1 });
        
        res.json(registrations);
    } catch (err) {
        console.error('Error fetching registrations:', err.message, err.stack);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

router.delete('/registrations/:registrationId', authMiddleware, async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.registrationId);
        
        if (!registration) {
            return res.status(404).json({ msg: 'Registration not found' });
        }
        
        if (registration.user.toString() !== req.userId) {
            return res.status(403).json({ msg: 'Not authorized to cancel this registration' });
        }
        
        await Registration.findByIdAndDelete(req.params.registrationId);
        res.json({ msg: 'Registration cancelled successfully' });
    } catch (err) {
        console.error('Error cancelling registration:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

module.exports = router;