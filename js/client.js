const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio = new Audio('ting.mp3');

// functon which will append the message and other things 
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
}

// if the form gets submit, send message to the server
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

// asking the user their name
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// if new-user joined, receive his/her name to other users
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
})

// send messages receive to the users
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
})
 // if user leave it will show to all
socket.on('left', name => {
    append(`${name} left the chat`, 'right');
})