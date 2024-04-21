const express = require('express');
const router = express.Router();

// Import your message model
 const Message = require('../models/Message');

// GET all messages
router.get('/', async (req, res) => {
  res.send('GET all messages');
});

// POST a new message
router.post('/', async (req, res) => {
  res.send('POST new message');
});

module.exports = router;
