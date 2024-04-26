require('dotenv').config(); // Make sure to require 'dotenv' at the top
const express = require('express');
const app = express();
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session)
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const path = require('path');
const username = 'jamesthorley291'; // Replace with your actual username
const password = encodeURIComponent('4auoXPWzYuGcxSU1'); // Replace with your actual password
// Models
const User = require('./models/User'); // Uncomment when User model is created
const Book = require('./models/Book'); // Uncomment when Book model is created
const Message = require('./models/Message'); // Uncomment when Message model is created
const { resourceLimits } = require('worker_threads');

const mongoUri = `mongodb+srv://${username}:${password}@cluster0.qvjhqe8.mongodb.net/`;




const PORT = process.env.PORT || 3000;


// Connect to MongoDB
mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB: ', err);
  });

const store = new MongoDBSession({
  uri: mongoUri,
  collection: 'mySessions',
})

app.use(session({
  secret: 'key that will sign cookie',
  resave: false,
  saveUninitialized: false,
  store: store,
}));

const isAuth = (req ,res, next) =>{
  if(req.session.isAuth){
    next()
  } else{
    res.redirect('/login')
  }
}

  // Parse incoming requests with JSON payloads



app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Routes
// Serve static files from the 'public' directory correctly
app.use(express.static(path.join(__dirname, 'public'))); // 'public' is at the same level as 'src'

// post method for registering 
app.post("/register" , async(req , res) => {
  const { username, email, password } = req.body;
  let user = await User.findOne({email});

  if(user){
    return res.redirect("/register")
  }
  const hashPassword = await bcrypt.hash(password, 12)
  user = new User ({
    username,
    email, 
    password: hashPassword
  });
  await user.save();
  res.redirect('/login')
});

app.post("/login", async (req,res) => {
 const { email, password } = req.body;

 const user = await User.findOne({email});
 if(!user){
  return res.redirect('/login');
 }
 const isMatch = await bcrypt.compare(password, user.password);

 if(!isMatch){
  return res.redirect("/login");
 }
 req.session.isAuth = true;
 req.session.userId = user._id;
 res.redirect('/home');
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
      if(err) {
          console.log(err);
          res.status(500).send('Could not log out, please try again.');
      } else {
          res.clearCookie('connect.sid'); // The name of the cookie used for the session. This might be different depending on your setup.
          res.redirect('/login');
      }
  });
});

// Endpoint to list books or return search results
app.get('/api/books/list', isAuth, async (req, res) => {
  const searchQuery = req.query.q || ''; // Get the search query parameter
  try {
    let books;
    if (searchQuery) {
      // Use a regex to search for the query in the title or author fields, case-insensitive
      books = await Book.find({
        $or: [
          { title: new RegExp(searchQuery, 'i') },
          { author: new RegExp(searchQuery, 'i') }
        ]
      }).populate('owner', 'username');
    } else {
      // If no search query, return all books
      books = await Book.find().populate('owner', 'username');
    }

    // Map the books to include only the required fields
    const booksToSend = books.map(book => ({
        title: book.title,
        author: book.author,
        ownerUsername: book.owner.username
    }));

    res.json(booksToSend);
  } catch (error) {
    console.error('Failed to get books:', error);
    res.status(500).send('Failed to get books.');
  }
});

app.post("/api/books/add", isAuth, async (req, res) => {
  // Extract book details from the form submission
  const { title, author } = req.body;

  try {
    // Create and save a new Book instance to the database
    const newBook = new Book({
      title,
      author,
      owner: req.session.userId // assuming you store user's ID in session upon login
    });

    await newBook.save();

    // Redirect to the account page or send a success message
    res.redirect('/home');
  } catch (error) {
    // If an error occurs, log it and send an error message
    console.error('Error adding book:', error);
    res.status(500).send('Error adding book.');
  }
});


// Correctly send 'Login.html' when the root route is accessed
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Login.html')); // No '..' needed
});
// Route for serving the registration page
app.get('/register', (req, res) => {
  req.session.isAuth = true;
  res.sendFile(path.join(__dirname, 'public', 'Registration.html'));
});
// Route for serving the login from the registration page 
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Login.html'));
});
app.get('/account', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Account.html'));
});
app.get('/home', isAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Homepage_English.html'));
});




// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
