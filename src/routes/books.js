const express = require('express');
const router = express.Router();

// Import your book model
 const Book = require('../models/Book');

// GET all books
router.get('/', async (req, res) => {
   const books = await Book.find();
   res.json(books);
  res.send('GET all books');
});

// POST a new book
router.post('/', async (req, res) => {
  res.send('POST new book');
});

module.exports = router;
