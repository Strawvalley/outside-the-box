import { of } from 'rxjs';
import { emitOnConnect, listenOnConnect } from './connection';

function getUsername() {
  const username = sessionStorage.getItem('username')

  if (username) return username

  let newUsername = prompt('Please enter a username', '')

  // If no username entered by user, generate random
  if (!newUsername) {
    const randomNum = Math.floor(Math.random() * 1000)
    newUsername = 'user' + randomNum
  }

  sessionStorage.setItem('username', newUsername)

  return newUsername
}

const room = "abc123";

emitOnConnect(of(getUsername())).subscribe(({ socket, data }) => {
  socket.emit('room', {
    room,
    username: data
  });
  console.log(`CONNECT ${data} to room ${room}`);
});

listenOnConnect('user joined room').subscribe(({ username, room }) => {
  console.log(`CONNECTED: ${username} joined the room ${room}`);
});