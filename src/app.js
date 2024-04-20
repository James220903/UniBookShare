const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

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
