const express = require('express');
const router = express.Router();

// Import your user model
const User = require('../models/User');

// POST a new user
router.post('/submit-registration', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" });
        }

        // Directly use the plaintext password
        const user = new User({
            username,
            email,
            password  // No hashing here
        });

        const newUser = await user.save();
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// POST route for user login
router.post('/login', async (req, res) => {
    try {
        console.log('Attempting login with:', req.body.email);
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            console.log('Login failed: User not found with email:', req.body.email);
            return res.status(401).json({ message: "Login failed: User not found." });
        }

        // Directly compare plaintext passwords
        if (req.body.password !== user.password) {
            return res.status(401).json({ message: "Login failed: Incorrect password." });
        }

        res.redirect('/Homepage_English.html');
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
