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

        const user = new User({
            username,
            email,
            password  // No need to hash here; the model's pre-save hook will take care of it
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
// Example login route in your users router file (conceptual)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await user.comparePassword(password)) {
      // Login successful, set session info
      req.session.userId = user._id; // Store user ID in session
      req.session.sessionID = req.sessionID; // Store the session ID (UUID generated) in session
      return res.redirect('/account'); // Redirect to the account page or send a success response
    } else {
      // Login failed
      return res.status(401).send('Login failed');
    }
  });

module.exports = router;


