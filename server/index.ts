import { server } from "./server";
import { connection$, disconnect$, listenOnConnect, ExtendedSocket, sendToRoomWithUserCallback } from "./connection";
import { GameManager } from "./managers/game_manager";
import { SocketEventNames, JoinRoomDto, GameDto } from '../shared';
import { logInfo, logWarning } from './managers/log_manager';

// Create HTTP server with "app" as handler
const port = process.env.PORT || 3000;
server.listen(port, () => logInfo(`Listening on port: ${port}`));

const gameManager = new GameManager(
  (room: string, toDto: (clientId: string) => { gameState: GameDto }) => sendToRoomWithUserCallback(room, SocketEventNames.UPDATE_GAME_STATE, toDto)
);

connection$.subscribe(({ client }) => {
  logInfo(`Client ${client.id} connected`);
});

disconnect$.subscribe(({ client }) => {
  logInfo(`Client ${client.id} disconnected`);
  if (gameManager.hasGame(client.room)) {
    gameManager.disconnectUserFromGame(client.room, client.id, client.username);
    // Update gameState for all users in room
    sendToRoomWithUserCallback(client.room, SocketEventNames.UPDATE_GAME_STATE, (clientId: string) => gameManager.getGameState(client.room, clientId));
  }
});

listenOnConnect<JoinRoomDto>(SocketEventNames.JOIN_ROOM).subscribe(({ io, client, data }) => {
  logInfo(`Client ${client.id} joins room ${data.room} as ${data.username}`);

  // Add user to the room
  // TODO: Make sure that user is only in one room!
  const allSockets = io.sockets.sockets as { [id: string]: ExtendedSocket };
  allSockets[client.id].username = data.username;
  allSockets[client.id].room = data.room;
  client.join(data.room);

  // Check if game already exists, if not -> create new game and set admin
  gameManager.createOrJoinGame(data.room, client.id, data.username);

  // Send update to all users
  sendToRoomWithUserCallback(client.room, SocketEventNames.UPDATE_GAME_STATE, (clientId: string) => gameManager.getGameState(client.room, clientId));
});

listenOnConnect<void>(SocketEventNames.START_GAME).subscribe(({ client }) => {
  try {
    gameManager.startGame(client.room, client.id);
    logInfo(`Starting game in room ${client.room}`);
  } catch (err) {
    logWarning(`Unauthorized request "START_GAME": ${err}`);
  }
});

listenOnConnect<void>(SocketEventNames.START_NEXT_ROUND).subscribe(({ client }) => {
  try {
    gameManager.startNextRound(client.room, client.username);
  } catch (err) {
    logWarning(`Unauthorized request "START_NEXT_ROUND: ${err}`);
  }
});

listenOnConnect<string>(SocketEventNames.SUBMIT_WORD).subscribe(({ client, data }) => {
  logInfo(`Player ${client.username} submitted word ${data} in room ${client.room}`);
  gameManager.submitWordForPlayer(client.room, client.username, data);
});

listenOnConnect<string>(SocketEventNames.SUBMIT_GUESS).subscribe(({ client, data }) => {
  logInfo(`Player ${client.username} submited guess ${data} in room ${client.room}`);
  gameManager.guessWordForPlayer(client.room, client.username, data);
});
