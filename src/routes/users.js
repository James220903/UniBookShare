const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Import your user model
const User = require('../models/User');

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        const userDtos = users.map(user => ({
            id: user._id,
            username: user.username,
            email: user.email
        }));
        res.json(userDtos);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: "Internal server error" });
    }
});

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

        const hashedPassword = await bcrypt.hash(password);

        const user = new User({
            username,
            email,
            password: hashedPassword
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
        console.log('Attempting login with:', req.body.email);  // Log email attempt
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            console.log('Login failed: User not found with email:', req.body.email);
            return res.status(401).json({ message: "Login failed: User not found." });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        console.log(`Password match for ${req.body.email}: ${isMatch}`);  // Detailed logging for password match

        if (!isMatch) {
            return res.status(401).json({ message: "Login failed: Incorrect password." });
        }

        res.redirect('/Homepage_English.html');
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
