import { Subject } from "rxjs";
import { emitOnConnect, listenOnConnect, listenOnConnectWithConnection } from "../connection";
import { SocketEventNames, GameDto, JoinRoomDto } from "../../shared";

export const createOrJoinGame$ = new Subject<{username: string; room?: string; lang?}>();

export const initiateGame$ = new Subject<void>();

export const submitWordSelection$ = new Subject<string>();
export const submitThinkingWord$ = new Subject<string>();
export const submitGuessingWord$ = new Subject<string>();

export const startNextRound$ = new Subject<void>();
export const pauseGame$ = new Subject<void>();
export const unpauseGame$ = new Subject<void>();

export function setupAppListeners(app): void {

  emitOnConnect<{username: string; room?: string; lang?: string}>(createOrJoinGame$)
    .subscribe(({ socket, data }) => {
      const payload: JoinRoomDto = {
        username: data.username,
        room: data.room,
        lang: data.lang
      }
      socket.emit(SocketEventNames.JOIN_ROOM, payload);
    });

  listenOnConnectWithConnection<{ gameState: GameDto }>(SocketEventNames.UPDATE_GAME_STATE)
    .subscribe(([{ gameState }, socket]) => {
      console.log(`<<<[INFO] GameState ${gameState.started}`);
      sessionStorage.setItem('username', gameState.username);
      window.history.pushState(gameState.room, 'Outside the box!', `/${gameState.room}`);
      app.game = gameState;
      app.socketId = socket.id;
    });

  listenOnConnect<string>(SocketEventNames.USERNAME_CHANGED)
    .subscribe((username) => {
      console.log(`<<<[INFO] Username changed: ${username}`);
      sessionStorage.setItem('username', username);
    });
}

emitOnConnect(initiateGame$)
  .subscribe(({ socket }) => {
    socket.emit(SocketEventNames.START_GAME);
  });

emitOnConnect<string>(submitWordSelection$)
  .subscribe(({ socket, data }) => {
    socket.emit(SocketEventNames.SUBMIT_WORD_SELECTION, data);
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
