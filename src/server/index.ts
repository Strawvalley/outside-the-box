import { connection$, disconnect$, listenOnConnect, ExtendedSocket, sendToUser, sendToRoom } from "./connection";
import { GameManager } from "./managers/game_manager";
import { SocketEventNames, JoinRoomDto, GameDto } from '../shared';
import { logInfo, logWarning } from './managers/log_manager';

const gameManager = new GameManager(
  (room: string, payload: { gameState: GameDto } ) => sendToRoom(room, SocketEventNames.UPDATE_GAME_STATE, payload),
  (clienId: string, payload: { gameState: GameDto }) => sendToUser(clienId, SocketEventNames.UPDATE_GAME_STATE, payload)
);

connection$.subscribe(({ client }) => {
  logInfo(`Client ${client.id} connected`);
});

disconnect$.subscribe(({ client }) => {
  logInfo(`Client ${client.id} disconnected`);
  if (gameManager.hasGame(client.room)) {
    const gameWasDeleted = gameManager.disconnectUserFromGame(client.room, client.id, client.username);
    if (!gameWasDeleted) {
      // Update gameState for all users in room
      gameManager.sendGameUpdate(client.room);
    } else {
      logInfo(`Game ${client.room} was deleted because all users were disconnected`);
    }
  }
});

listenOnConnect<JoinRoomDto>(SocketEventNames.JOIN_ROOM).subscribe(({ io, client, data }) => {
  if (data.room === undefined) {
    data.room = Math.floor(Math.random() * 100000).toString();
  }
  if (!data.username) {
    data.username = 'user' + Math.floor(Math.random() * 1000);
  }
  logInfo(`Client ${client.id} joins room ${data.room} as ${data.username}`);

  // Add user to the room
  // TODO: Make sure that user is only in one room
  const allSockets = io.sockets.sockets as { [id: string]: ExtendedSocket };
  allSockets[client.id].room = data.room;
  client.join(data.room);

  // Check if game already exists, if not -> create new game and set admin
  // Returns the username under which the user joined the game to prevent duplicates
  const userJoinedAs = gameManager.createOrJoinGame(data.room, client.id, data.username, data.lang);

  allSockets[client.id].username = userJoinedAs;

  if (userJoinedAs !== data.username) {
    sendToUser(client.id, SocketEventNames.USERNAME_CHANGED, userJoinedAs);
  }

  // Send update to all users
  gameManager.sendGameUpdate(data.room);
});

listenOnConnect<void>(SocketEventNames.START_GAME).subscribe(({ client }) => {
  try {
    gameManager.startGame(client.room, client.id);
    logInfo(`Starting game in room ${client.room}`);
  } catch (err) {
    logWarning(`Error "START_GAME": ${err}`);
  }
});

listenOnConnect<void>(SocketEventNames.PAUSE_GAME).subscribe(({ client }) => {
  try {
    logInfo(`Pause game ${client.room}`);
    gameManager.pauseGame(client.room, client.id);
  } catch (err) {
    logWarning(`Unauthorized request "PAUSE_GAME": ${err}`);
  }
});

listenOnConnect<void>(SocketEventNames.UNPAUSE_GAME).subscribe(({ client }) => {
  try {
    logInfo(`Unpause game ${client.room}`);
    gameManager.unpauseGame(client.room, client.id);
  } catch (err) {
    logWarning(`Unauthorized request "UNPAUSE_GAME": ${err}`);
  }
});

listenOnConnect<void>(SocketEventNames.START_NEXT_ROUND).subscribe(({ client }) => {
  try {
    gameManager.startNextRound(client.room, client.username);
  } catch (err) {
    logWarning(`Unauthorized request "START_NEXT_ROUND: ${err}`);
  }
});

listenOnConnect<string>(SocketEventNames.SUBMIT_WORD_SELECTION).subscribe(({ client, data }) => {
  logInfo(`Player ${client.username} submited word selection ${data} in room ${client.room}`);
  gameManager.submitWordSelection(client.room, client.username, data);
});

listenOnConnect<string>(SocketEventNames.SUBMIT_WORD).subscribe(({ client, data }) => {
  logInfo(`Player ${client.username} submitted word ${data} in room ${client.room}`);
  gameManager.submitWordForPlayer(client.room, client.username, data);
});

listenOnConnect<string>(SocketEventNames.SUBMIT_GUESS).subscribe(({ client, data }) => {
  logInfo(`Player ${client.username} submited guess ${data} in room ${client.room}`);
  gameManager.guessWordForPlayer(client.room, client.username, data);
});
