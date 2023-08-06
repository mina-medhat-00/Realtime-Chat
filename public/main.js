const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const socket = io();

// get username and room from the URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// join chatroom
socket.emit("joinRoom", { username, room });

// message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // scroll down after sending a message
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // get message text
  const msg = e.target.elements.msg.value;
  // emit the message to server
  socket.emit("chatMessage", msg);
  // clear message text after sending a message and focus on nessage bar
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">${message.text}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join("")}`;
}
