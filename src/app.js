require('dotenv').config(); // Make sure to require 'dotenv' at the top
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const username = 'jamesthorley291'; // Replace with your actual username
const password = encodeURIComponent('4auoXPWzYuGcxSU1'); // Replace with your actual password


// Models
const User = require('./models/User'); // Uncomment when User model is created
const Book = require('./models/Book'); // Uncomment when Book model is created
const Message = require('./models/Message'); // Uncomment when Message model is created

// Import routers
const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');
const messagesRouter = require('./routes/messages');

// Express app setup
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
// Note that we're not specifying the database name in the URI
const mongoUri = `mongodb+srv://${username}:${password}@cluster0.qvjhqe8.mongodb.net/`;

// Connect to MongoDB
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));




// Parse incoming requests with JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Routes
// Serve static files from the 'public' directory correctly
app.use(express.static(path.join(__dirname, 'public'))); // 'public' is at the same level as 'src'

// Correctly send 'Login.html' when the root route is accessed
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Login.html')); // No '..' needed
});
// Route for serving the registration page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Registration.html'));
});
// Route for serving the login from the registration page 
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Login.html'));
});
app.post('/api/users/login', async (req, res) => {
  console.log(req.body); // Check what data is coming in
  // Rest of your login logic...
});



// Add more route handlers here
// Use routers
app.use('/api/users', usersRouter);
app.use('/api/books', booksRouter);
app.use('/api/messages', messagesRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
