export const displayMessage = (message, type) => {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message ${type}`;
    messageContainer.textContent = message;

    // Append the message to the body or a specific container
    document.body.appendChild(messageContainer);

    // Remove the message after a few seconds
    setTimeout(() => {
        messageContainer.remove();
    }, 5000); // Adjust the time as needed
};