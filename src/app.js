require('dotenv').config();
const mongoose = require('mongoose');

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace the 'DB_USER', 'DB_PASS', and 'DB_NAME' placeholders with your actual environment variables
const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qvjhqe8.mongodb.net/${process.env.DB_NAME}`;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB database');
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Send 'Login.html' when the root route is accessed
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'Login.html'));
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
