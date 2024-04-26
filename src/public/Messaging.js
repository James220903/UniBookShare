document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const messageContainer = document.getElementById('message-container');
    const receiverId = 'someUserIdOrUsername';  // Define the receiver's ID or username

    // Function to append messages to the container
    const appendMessage = (message, fromSelf) => {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = fromSelf ? 'my-message' : 'their-message';
        messageContainer.appendChild(messageDiv);
    };

    messageForm.addEventListener('submit', event => {
        event.preventDefault();
        const message = messageInput.value;
        if (!message) return;

        fetch('/api/messages/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                content: message, 
                to: receiverId  // Use the receiverId in the POST request
            }),
            credentials: 'include'  // Ensures cookies, such as session cookies, are sent with the request
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                // Handle success
                appendMessage(message, true);
                messageInput.value = ''; // Clear input after sending
            } else {
                // Handle failure
                console.error('Failed to send message:', data.error);
            }
        })
        .catch(error => console.error('Error sending message:', error));
    });
});
