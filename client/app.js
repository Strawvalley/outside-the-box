import { of } from 'rxjs';
import { emitOnConnect, listenOnConnect, listenOnConnectWithConnection } from './connection';
import { getUsername, getRoom, addUser, removeUser, clearUsers, displayRoomName, displayUsername, displayGameState } from './utils'
import initiateGame$ from './actions';

console.log(`[INIT] outside-the-box`)

const room = getRoom();
displayRoomName(room);

emitOnConnect(of(getUsername()))
  .subscribe(({ socket, data }) => {
    socket.emit('room', {
      room,
      username: data
    });
    displayUsername(data);
    console.log(`>>>[CONNECT] ${data} to room ${room}`);
  });

listenOnConnect('all users in room update')
  .subscribe(users => {
    console.log(`<<<[INFO] There are currently ${users.length} users in the room`);
    clearUsers();
    users.forEach(({ id, username, isAdmin }) => addUser(id, username, isAdmin));
  });

listenOnConnect('user left room')
  .subscribe(({ username, room, id }) => {
    console.log(`<<<[INFO] ${username} (${id}) left the room ${room}`);
    removeUser(id);
  });

listenOnConnectWithConnection('update game state')
  .subscribe(([{ gameState }, socket]) => {
    console.log(`<<<[INFO] GameState ${gameState.started}`);
    displayGameState(gameState, socket.id);
  });

emitOnConnect(initiateGame$)
  .subscribe(({ socket }) => {
    socket.emit('initiate game');
  });