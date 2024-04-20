// Require the express module
const express = require('express');

// Create an instance of express called 'app'
const app = express();

// Define the port number as a variable
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define a route for the root of the app
app.get('/', (req, res) => {
  res.send('Welcome to UniBookShare!');
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
