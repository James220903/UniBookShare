const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const User = require('../models/User'); // Assuming you might also need user information

// POST a new book
router.post('/add', async (req, res) => {
    try {
        const { title, author } = req.body;
        if (!title || !author) {
            return res.status(400).send('Both title and author are required');
        }

        // Assuming req.userId is the ID of the logged-in user, you would typically set this in your authentication middleware
        const userId = req.userId;

        const newBook = new Book({
            title: title,
            author: author,
            owner: userId  // Set the owner to the logged-in user's ID
        });

        await newBook.save();
        res.status(201).json(newBook);
    } catch (err) {
        console.error('Error creating new book:', err);
        res.status(500).send('Error saving the book');
    }
});

router.get('/list', async (req, res) => {
  try {
      const books = await Book.find({});  // Fetch all books
      res.json(books);
  } catch (err) {
      res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;