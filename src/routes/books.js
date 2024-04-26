const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const User = require('../models/User'); // Assuming you might also need user information

// POST a new book


router.get('/list', async (req, res) => {
  try {
      const books = await Book.find({});  // Fetch all books
      res.json(books);
  } catch (err) {
      res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;