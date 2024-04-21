const express = require('express');
const router = express.Router();

// Import your user model
 const User = require('../models/User');

// GET all users
router.get('/', async (req, res) => {
  try {
     const users = await User.find();
     res.json(users);
    res.send('GET all users');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new user
router.post('/', async (req, res) => {
   const user = new User({
     name: req.body.name,
  //   // other properties
   });
   try {
     const newUser = await user.save();
     res.status(201).json(newUser);
   } catch (err) {
     res.status(400).json({ message: err.message });
   }
  res.send('POST new user');
});

module.exports = router;
