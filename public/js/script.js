const btnStartChat = document.querySelector('.btn__start-chat');
const sendingMsgForm = document.querySelector('.sending-msg');
const btnSend = document.querySelector('.btn__send');
const msgsContainer = document.querySelector('.messages-container');
const usersContainer = document.querySelector('.users');
const roomContainer = document.querySelector('.messages-heading');
const roomName = document.getElementById('room-name');
const userName = document.querySelector('.user-name');

// Get room and username from URL
const { room, username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Get room and users info from server
socket.on('roomUsers', ({ room, users }) => {
  outputRoom(room);
  outputUsers(users);
});
// Join chat room
socket.emit('joinRoom', { username, room });

// Message from server
socket.on('message', (message) => {
  addMsg(message);

  // Scroll down
  msgsContainer.scrollTop = msgsContainer.scrollHeight;
});

const addMsg = (msg) => {
  const html = `  <div class="card msg-card">
  <h2 class="card-heading">${msg.username} <span class="time">${msg.time}</span></h2>
  <p class="card-txt msg-decs">${msg.text}</p>
</div>`;
  if (msgsContainer) msgsContainer.insertAdjacentHTML('beforeend', html);
};

const outputMessage = () => {
  const sendingMsgInput = document.querySelector('.input__msg');
  if (sendingMsgInput.value) {
    // Emit msg to server
    socket.emit('chatMessage', sendingMsgInput.value);

    // Clear input after send msg
    sendingMsgInput.value = '';

    // Focus on input after that
    sendingMsgInput.focus();
  }
};

const outputRoom = (room) => {
  roomName.innerHTML = room.toUpperCase();
};

const outputUsers = (users) => {
  while (usersContainer.firstChild) {
    usersContainer.removeChild(usersContainer.lastChild);
  }
  users.map((element) => {
    if (element.userName === userName) userName.value = '';
    const html = `<div class="card-sm"><p class="card-txt user-name">${element.username}</p></div>`;
    usersContainer.insertAdjacentHTML('afterbegin', html);
  });
};

if (btnSend)
  btnSend.addEventListener('click', (e) => {
    e.preventDefault();
    outputMessage();
  });

if (sendingMsgForm)
  sendingMsgForm.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      outputMessage();
    }
  });
