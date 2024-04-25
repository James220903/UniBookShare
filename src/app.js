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


  // Parse incoming requests with JSON payloads



app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Routes
// Serve static files from the 'public' directory correctly
app.use(express.static(path.join(__dirname, 'public'))); // 'public' is at the same level as 'src'


app.post("/register" , async(req , res) => {
  const { username, email, password } = req.body;
  let user = await User.findOne({email});

  if(user){
    return res.sendFile(path.join(__dirname, 'public', 'Registration.html'));
  }
  const hashPassword = await bcrypt.hash(password, 12)
  user = new user ({
    username,
    email, 
    password: hashPassword
  });
  await user.save();
  res.redirect('/login')
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




// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
