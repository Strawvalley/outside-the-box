import { Subject, of } from "rxjs";
import { emitOnConnect, listenOnConnect, listenOnConnectWithConnection } from "../connection";
import { SocketEventNames, GameDto, JoinRoomDto } from "../../shared";

export function setUsername(username: string): void {
  sessionStorage.setItem('username', username);
  document.querySelector('#username').textContent = username;
}

export function getUsername(): string {
  const username = sessionStorage.getItem('username');

  if (username) {
    setUsername(username);
    return username;
  }

  let newUsername = prompt('Please enter a username', '');

  // If no username entered by user, generate random
  if (!newUsername) {
    const randomNum = Math.floor(Math.random() * 1000);
    newUsername = 'user' + randomNum;
  }

  setUsername(newUsername);

  return newUsername;
}

function getRoom(): string {
  const roomName = location.pathname.split('/')[1]
  if (!roomName) return Math.floor(Math.random() * 100000).toString();
  return roomName;
}

function displayRoomName(room: string): void {
  document.querySelector('#room').textContent = room;
  window.history.pushState(room, 'Outside the box!', `/${room}`);
}

export function setupApp(app): void {
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
      app.game = gameState;
      app.socketId = socket.id;
    });

  listenOnConnect<string>(SocketEventNames.USERNAME_CHANGED)
    .subscribe((username) => {
      console.log(`<<<[INFO] Username changed: ${username}`);
      app.username = username;
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
