import { of } from 'rxjs';
import { emitOnConnect, listenOnConnect, listenOnConnectWithConnection } from './connection';
import { getUsername, getRoom, addUser, removeUser, clearUsers, displayRoomName, displayUsername, displayGameState } from './utils'
import { initiateGame$, submitThinkingWord$ } from './actions';
import { JoinRoomDto, IGame, IUser, SocketEventNames } from '../shared';

console.log(`[INIT] outside-the-box`)

const room = getRoom();
displayRoomName(room);

emitOnConnect<string>(of(getUsername()))
  .subscribe(({ socket, data }) => {
    const payload: JoinRoomDto = {
      room,
      username: data
    }
    socket.emit(SocketEventNames.JOIN_ROOM, payload);
    displayUsername(data);
    console.log(`>>>[CONNECT] ${data} to room ${room}`);
  });

listenOnConnect<IUser[]>(SocketEventNames.UPDATE_ROOM_USERS)
  .subscribe((users) => {
    console.log(`<<<[INFO] There are currently ${users.length} users in the room`);
    clearUsers();
    users.forEach(({ id, username, isAdmin }) => addUser(id, username, isAdmin));
  });

listenOnConnect<{ username: string; room: string; id: string }>(SocketEventNames.USER_LEFT_ROOM)
  .subscribe(({ username, room, id }) => {
    console.log(`<<<[INFO] ${username} (${id}) left the room ${room}`);
    removeUser(id);
  });

listenOnConnectWithConnection<{ gameState: IGame }>(SocketEventNames.UPDATE_GAME_STATE)
  .subscribe(([{ gameState }, socket]) => {
    console.log(`<<<[INFO] GameState ${gameState.started}`);
    displayGameState(gameState, socket.id);
  });

emitOnConnect(initiateGame$)
  .subscribe(({ socket }) => {
    socket.emit(SocketEventNames.INITIATE_GAME);
  });

emitOnConnect<string>(submitThinkingWord$)
  .subscribe(({ socket, data }) => {
    socket.emit(SocketEventNames.SUBMIT_WORD, data);
  });
