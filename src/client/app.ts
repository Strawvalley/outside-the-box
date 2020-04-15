import { of } from 'rxjs';
import { emitOnConnect, listenOnConnectWithConnection, listenOnConnect } from './connection';
import { getUsername, getRoom, displayRoomName, displayGameState, setUsername } from './utils'
import { initiateGame$, submitThinkingWord$, submitGuessingWord$, startNextRound$, pauseGame$, unpauseGame$ } from './actions';
import { JoinRoomDto, GameDto, SocketEventNames } from '../shared';

import './app.css';

console.log(`[INIT] outside-the-box`)

const room = getRoom();
displayRoomName(room);

emitOnConnect<string>(of(getUsername()))
  .subscribe(({ socket, data }) => {
    const payload: JoinRoomDto = {
      room,
      username: data,
      // lang: "en"
    }
    socket.emit(SocketEventNames.JOIN_ROOM, payload);
    console.log(`>>>[INFO] Connect to room ${room}`);
  });

listenOnConnectWithConnection<{ gameState: GameDto }>(SocketEventNames.UPDATE_GAME_STATE)
  .subscribe(([{ gameState }, socket]) => {
    console.log(`<<<[INFO] GameState ${gameState.started}`);
    displayGameState(gameState, socket.id);
  });

listenOnConnect<string>(SocketEventNames.USERNAME_CHANGED)
  .subscribe((username) => {
    console.log(`<<<[INFO] Username changed: ${username}`);
    setUsername(username);
  });

emitOnConnect(initiateGame$)
  .subscribe(({ socket }) => {
    socket.emit(SocketEventNames.START_GAME);
  });

emitOnConnect<string>(submitThinkingWord$)
  .subscribe(({ socket, data }) => {
    socket.emit(SocketEventNames.SUBMIT_WORD, data);
  });

emitOnConnect(startNextRound$)
  .subscribe(({ socket }) => {
    socket.emit(SocketEventNames.START_NEXT_ROUND);
  });

emitOnConnect<string>(submitGuessingWord$)
  .subscribe(({ socket, data }) => {
    socket.emit(SocketEventNames.SUBMIT_GUESS, data);
  });

emitOnConnect(pauseGame$)
  .subscribe(({ socket }) => {
    socket.emit(SocketEventNames.PAUSE_GAME);
  });

emitOnConnect(unpauseGame$)
  .subscribe(({ socket }) => {
    socket.emit(SocketEventNames.UNPAUSE_GAME);
  });

