// Pseudocode Plan:
// 1. Extract socket initialization and event listeners into separate functions
// 2. Use more descriptive variable names
// 3. Implement error handling for missing DOM elements
// 4. Use template literals for string interpolation
// 5. Separate concerns by moving message appending logic to a separate function

// Initialize the socket connection
const socket = io();

document.addEventListener('DOMContentLoaded', initializeChat);

function initializeChat() {
  const messageFormElement = document.getElementById('message-form');
  const messageInputElement = document.getElementById('message-input');
  const messageContainerElement = document.getElementById('message-container');

  // Error handling for missing DOM elements
  if (!messageFormElement || !messageInputElement || !messageContainerElement) {
    console.error('Missing required DOM elements');
    return;
  }

  const roomId = sessionStorage.getItem('bookId');
  const username = sessionStorage.getItem('username');

  if (roomId) {
    socket.emit('joinRoom', { roomId, username });
  }

  setupSocketListeners(messageContainerElement);
  setupMessageFormListener(messageFormElement, messageInputElement, roomId);
}

function setupSocketListeners(messageContainerElement) {
  socket.on('message', (message) => {
    appendMessage(messageContainerElement, message, false);
  });
}

function setupMessageFormListener(messageFormElement, messageInputElement, roomId) {
  messageFormElement.addEventListener('submit', (event) => {
    event.preventDefault();
    const messageText = messageInputElement.value.trim();
    if (!messageText) return;

    socket.emit('chatMessage', { roomId, message: messageText });
    appendMessage(messageContainerElement, messageText, true);
    messageInputElement.value = '';
  });
}

function appendMessage(messageContainerElement, message, isSelf) {
  const messageElement = document.createElement('div');
  messageElement.textContent = `${isSelf ? 'You' : 'Other'}: ${message}`;
  messageContainerElement.appendChild(messageElement);
}