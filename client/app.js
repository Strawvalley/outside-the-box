import { of } from 'rxjs';
import { emitOnConnect, listenOnConnect, listenOnConnectWithConnection } from './connection';
import { getUsername, getRoom, addUser, removeUser, clearUsers, displayRoomName, displayUsername, displayGameState } from './utils'
import { initiateGame$, submitThinkingWord$ } from './actions';
import { SocketEventNames } from '../shared/enums/socket_event_names';

console.log(`[INIT] outside-the-box`)

const room = getRoom();
displayRoomName(room);

emitOnConnect(of(getUsername()))
  .subscribe(({ socket, data }) => {
    socket.emit(SocketEventNames.JOIN_ROOM, {
      room,
      username: data
    });
    displayUsername(data);
    console.log(`>>>[CONNECT] ${data} to room ${room}`);
  });

listenOnConnect(SocketEventNames.UPDATE_ROOM_USERS)
  .subscribe(users => {
    console.log(`<<<[INFO] There are currently ${users.length} users in the room`);
    clearUsers();
    users.forEach(({ id, username, isAdmin }) => addUser(id, username, isAdmin));
  });

listenOnConnect(SocketEventNames.USER_LEFT_ROOM)
  .subscribe(({ username, room, id }) => {
    console.log(`<<<[INFO] ${username} (${id}) left the room ${room}`);
    removeUser(id);
  });

listenOnConnectWithConnection(SocketEventNames.UPDATE_GAME_STATE)
  .subscribe(([{ gameState }, socket]) => {
    console.log(`<<<[INFO] GameState ${gameState.started}`);
    displayGameState(gameState, socket.id);
  });

emitOnConnect(initiateGame$)
  .subscribe(({ socket }) => {
    socket.emit(SocketEventNames.INITIATE_GAME);
  });

emitOnConnect(submitThinkingWord$)
  .subscribe(({ socket, data }) => {
    socket.emit(SocketEventNames.SUBMIT_WORD, data);
  });