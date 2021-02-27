// DOM ELEMENTS
const messageBoxDOM = document.querySelector('.room__content--messages');
const memberJoinedDOM = document.querySelector('.member__joined');
const usersNameDOM = document.querySelector('.room__users--name');
const roomNameDOM = document.querySelector('.room__name');
const sendMessageDOM = document.querySelector('.message__submitDOM');
const roomDOM = document.querySelector('.room');
const leaveRoomDOM = document.querySelector('.leave__roomDOM');
const currentUserDOM = document.querySelector('.currentUser');

const audio = new Audio('../messageTone.mp3');

// GET USERNAME AND ROOM FROM URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

const outputMessage = (message) => {
  const el = `<div class="message__box ${
    message.position === 'right' ? 'shift__right' : ''
  }"><p class="owner__info">${message.username} ${
    message.time
  }</p><div class="message__content">
		<p class="message">${message.text}</p></div></div>`;

  messageBoxDOM.insertAdjacentHTML('beforeend', el);
  if (message.position !== 'right') audio.play();
};

// JOIN CHATROOM
socket.emit('joinRoom', username, room);

socket.on('message', (message) => {
  outputMessage(message);

  // Scroll down
  messageBoxDOM.scrollTop = messageBoxDOM.scrollHeight;
});

socket.on('centerMessage', (message) => {
  const centerEl = `<p class="member__joined">${message.username}: ${message.text}</p>`;
  messageBoxDOM.insertAdjacentHTML('beforeend', centerEl);
});

socket.on('roomUsers', (users) => {
  usersNameDOM.innerHTML = '';
  roomNameDOM.textContent = users.room;

  users.usersName.forEach((user) => {
    const el = `<p class="users--name">${user.username}</p>`;
    usersNameDOM.insertAdjacentHTML('beforeend', el);
  });
});

socket.on('currentUser', (userName) => {
  document.querySelector('.header__name').textContent = userName;
});

const readEmitMsg = () => {
  let msg = document.querySelector('.message__input').value;
  msg = msg.trim();

  if (!msg) {
    return false;
  }
  socket.emit('chatMessage', msg);

  document.querySelector('.message__input').value = '';
  document.querySelector('.message__input').focus();
};

sendMessageDOM.addEventListener('click', (e) => {
  e.preventDefault();
  readEmitMsg();
});

if (roomDOM) {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      readEmitMsg();
    }
  });
}

leaveRoomDOM.addEventListener('click', (e) => {
  e.preventDefault();
  const ans = confirm('Are you sure you want to leave the room ?');

  if (ans) window.location.assign('/');
});
