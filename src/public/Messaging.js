const socket = io();

const messageContainerElement = document.getElementById('message-container');
const messageFormElement = document.getElementById('message-form');
const messageInputElement = document.getElementById('message-input');

// Join a room
socket.on('joinRoom', ({ roomId, username }) => {
  socket.join(roomId);
  console.log(`${username} joined room: ${roomId}`);
});

// Send a message
messageFormElement.addEventListener('submit', (event) => {
  event.preventDefault();
  const messageText = messageInputElement.value.trim();
  if (!messageText) return;

  socket.emit('chatMessage', { roomId, message: messageText });
  appendMessage(messageContainerElement, messageText, true);
  messageInputElement.value = '';
});

// Receive a message
socket.on('message', (message) => {
  appendMessage(messageContainerElement, message, false);
});

// Append a message to the message container
function appendMessage(messageContainerElement, message, isSelf) {
  const messageElement = document.createElement('div');
  messageElement.textContent = `${isSelf? 'You' : 'Other'}: ${message}`;
  messageContainerElement.appendChild(messageElement);
}