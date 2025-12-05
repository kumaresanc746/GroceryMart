const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// User Signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password,
            phone,
            address: address || ''
        });

        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User created successfully',
            token,
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.json({
            message: 'Login successful',
            token,
            userId: user._id,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

