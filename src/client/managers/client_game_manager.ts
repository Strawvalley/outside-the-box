import { Subject, of, combineLatest } from "rxjs";
import { emitOnConnect, listenOnConnect, listenOnConnectWithConnection } from "../connection";
import { SocketEventNames, GameDto, JoinRoomDto } from "../../shared";

export function getUsername(): string {
  const username = sessionStorage.getItem('username');
  if (username) return username;

  let newUsername = prompt('Please enter a username', '');
  if (!newUsername) newUsername = 'user' + Math.floor(Math.random() * 1000);
  sessionStorage.setItem('username', newUsername);
  return newUsername;
}

function getRoom(): string {
  const roomName = location.pathname.split('/')[1]
  if (roomName) return roomName;

  const newRoom = Math.floor(Math.random() * 100000).toString();
  window.history.pushState(newRoom, 'Outside the box!', `/${newRoom}`);
  return newRoom
}

export function setupAppListeners(app): void {

  emitOnConnect<[string, string]>(combineLatest(of(getUsername()), of(getRoom())))
    .subscribe(({ socket, data }) => {
      const payload: JoinRoomDto = {
        username: data[0],
        room: data[1],
        // lang: "en"
      }
      socket.emit(SocketEventNames.JOIN_ROOM, payload);
      console.log(`>>>[INFO] Connect to room ${data[1]}`);
    });

  listenOnConnectWithConnection<{ gameState: GameDto }>(SocketEventNames.UPDATE_GAME_STATE)
    .subscribe(([{ gameState }, socket]) => {
      console.log(`<<<[INFO] GameState ${gameState.started}`);
      app.game = gameState;
      app.socketId = socket.id;
    });

  listenOnConnect<string>(SocketEventNames.USERNAME_CHANGED)
    .subscribe((username) => {
      console.log(`<<<[INFO] Username changed: ${username}`);
      sessionStorage.setItem('username', username);
    });
}

export const initiateGame$ = new Subject<void>();

export const submitWordSelection$ = new Subject<string>();
export const submitThinkingWord$ = new Subject<string>();
export const submitGuessingWord$ = new Subject<string>();

export const startNextRound$ = new Subject<void>();
export const pauseGame$ = new Subject<void>();
export const unpauseGame$ = new Subject<void>();

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
