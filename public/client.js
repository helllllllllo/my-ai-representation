
let messages = [];
let context = '';


document.getElementById('input-form').onsubmit = function(e) {
    e.preventDefault();

    const inputField = document.getElementById('input-field');
    const chatbox = document.getElementById('chatbox');

    // Append the user's message to the chatbox
    chatbox.innerHTML += `<div class='message user-message'>${inputField.value}</div>`;

     // Show typing indicator
     const typingIndicator = document.createElement('p');
     typingIndicator.classList.add('message', 'ai-message', 'typing-indicator');
     typingIndicator.textContent = '.';
     const dotsSpan = document.createElement('span');
     typingIndicator.appendChild(dotsSpan);
     chatbox.appendChild(typingIndicator);
 
     // Animate typing indicator
     let dotCount = 0;
     const typingInterval = setInterval(() => {
         dotCount = (dotCount + 1) % 5;
         const dots = '.'.repeat(dotCount);
         dotsSpan.textContent = dots;
     }, 500);


    let serverUrl = 'http://localhost:3000'

    fetch(serverUrl + '/chat', {
        method: 'POST',
        body: JSON.stringify({
            message: inputField.value,
            messages: messages
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
      .then(data => {
        // Stop typing indicator
        clearInterval(typingInterval);
        chatbox.removeChild(typingIndicator);
          // Append the bot's response to the chatbox
          chatbox.innerHTML += `<div class='message ai-message'>${data.response}</div>`;
          chatbox.scrollTop = chatbox.scrollHeight; // Keep the chatbox view scrolled to the bottom
          messages = data.messages;
      });

    // Clear the input field for the next message
    inputField.value = '';
};

window.onload = function() {
    const chatbox = document.getElementById('chatbox');
    chatbox.innerHTML += `<p class="message ai-message">Hi there, I'm Joe. What would you like to know more about me?</p>`;
}




