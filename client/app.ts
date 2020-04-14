import { of } from 'rxjs';
import { emitOnConnect, listenOnConnectWithConnection } from './connection';
import { getUsername, getRoom, displayRoomName, displayUsername, displayGameState } from './utils'
import { initiateGame$, submitThinkingWord$, submitGuessingWord$ } from './actions';
import { JoinRoomDto, GameDto, SocketEventNames } from '../shared';

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

listenOnConnectWithConnection<{ gameState: GameDto }>(SocketEventNames.UPDATE_GAME_STATE)
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

emitOnConnect<string>(submitGuessingWord$)
  .subscribe(({ socket, data }) => {
    socket.emit(SocketEventNames.SUBMIT_GUESS, data);
  });
