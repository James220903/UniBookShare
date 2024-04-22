const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Import your user model
const User = require('../models/User');

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users); // This sends the response with the users, no need to use res.send after this
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new user
router.post('/submit-registration', async (req, res) => {
    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create a new user instance with the hashed password and other properties
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword // Make sure to store the hashed password
        });

        // Save the new user to the database
        const newUser = await user.save();
        res.status(201).json({ message: "User created", user: newUser });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// POST route for user login
router.post('/login', async (req, res) => {
  try {
    // Find the user by their email address
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Login failed. User not found." });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Login failed. Incorrect password." });
    }

    // Login successful, redirect to Homepage_English.html
    res.redirect('/Homepage_English.html');
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// ... export router ...
module.exports = router;

module.exports = router;
