require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const path = require('path');
const username = 'jamesthorley291';
const password = encodeURIComponent('4auoXPWzYuGcxSU1');

// Models
const User = require('./models/User');
const Book = require('./models/Book');
const Message = require('./models/Message');

const mongoUri = `mongodb+srv://${username}:${password}@cluster0.qvjhqe8.mongodb.net/`;
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

const store = new MongoDBSession({
  uri: mongoUri,
  collection: 'mySessions',
});

app.use(session({
  secret: 'key that will sign cookie',
  resave: false,
  saveUninitialized: false,
  store: store,
}));

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect('/login');
  }
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Register a new user
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.redirect("/register");
  }

  // Create a new user instance
  const user = new User({
    username,
    email,
    password,
  });

  // Save the new user
  try {
    await user.save();
    res.redirect('/login');
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("Error registering user.");
  }
});

// User login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.trim() });
  if (!user) {
    return res.redirect('/login');
  }
  const isMatch = await bcrypt.compare(password.trim(), user.password);
  if (!isMatch) {
    return res.redirect("/login");
  }
  req.session.isAuth = true;
  req.session.userId = user._id;
  res.redirect('/home');
});

// User logout
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      res.status(500).send('Could not log out, please try again.');
    } else {
      res.clearCookie('connect.sid');
      res.redirect('/login');
    }
  });
});

// List books or return search results
app.get('/api/books/list', isAuth, async (req, res) => {
  const searchQuery = req.query.q || '';
  try {
    let books;
    if (searchQuery) {
      books = await Book.find({
        $or: [
          { title: new RegExp(searchQuery, 'i') },
          { author: new RegExp(searchQuery, 'i') }
        ]
      }).populate('owner', 'username');
    } else {
      books = await Book.find().populate('owner', 'username');
    }

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

// Add a new book
app.post("/api/books/add", isAuth, async (req, res) => {
  const { title, author } = req.body;

  try {
    const newBook = new Book({
      title,
      author,
      owner: req.session.userId,
    });

    await newBook.save();
    res.redirect('/home');
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).send('Error adding book.');
  }
});

// Send a message
app.post('/api/messages/send', isAuth, async (req, res) => {
  const { content, to } = req.body;
  if (!mongoose.Types.ObjectId.isValid(to)) {
    return res.status(400).json({ error: 'Invalid recipient ID format' });
  }
  try {
    const newMessage = new Message({
      from: req.session.userId,
      to: to,
      content: content
    });
    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message', details: error });
  }
});

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Login.html'));
});

app.get('/register', (req, res) => {
  req.session.isAuth = true;
  res.sendFile(path.join(__dirname, 'public', 'Registration.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Login.html'));
});

app.get('/account', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Account.html'));
});

app.get('/home', isAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Homepage_English.html'));
});

app.get('/messaging', isAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Messaging.html'));
});

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');

  // Join a room
  socket.on('joinRoom', ({ roomId, username }) => {
    socket.join(roomId);
    console.log(`${username} joined room: ${roomId}`);

    // Broadcast to the room, excluding the sender
    socket.to(roomId).broadcast.emit('message', `${username} has joined the chat`);
  });

  // Handle sending and receiving messages
  socket.on('chatMessage', ({ roomId, message }) => {
    io.to(roomId).emit('message', message);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});