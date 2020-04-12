import { server } from "./server";
import { connection$, disconnect$, listenOnConnect, ExtendedSocket } from "./connection";
import { GameManager } from "./managers/game_manager";
import { SocketEventNames } from '../shared/enums/socket_event_names';
import { logInfo, logWarning } from './managers/log_manager';

// Create HTTP server with "app" as handler
const port = process.env.PORT || 3000;
server.listen(port, () => logInfo(`Listening on port: ${port}`));

const gameManager = new GameManager();

connection$.subscribe(({ client }) => {
  logInfo(`Client ${client.id} connected`);
});

disconnect$.subscribe(({ io, client }) => {
  logInfo(`Client ${client.id} disconnected`);

  if (client.room) {
    io.in(client.room).emit(SocketEventNames.USER_LEFT_ROOM, {
      username: client.username,
      room: client.room,
      id: client.id
    });
    gameManager.removeUserFromGame(client.room, client.id);
  }

  if (gameManager.hasGame(client.room)) {
    io.in(client.room).emit(SocketEventNames.UPDATE_ROOM_USERS, gameManager.getUsersFromGame(client.room));
    io.in(client.room).emit(SocketEventNames.UPDATE_GAME_STATE, gameManager.getGameState(client.room));
  }
});

listenOnConnect<{ username: string; room: string }>(SocketEventNames.JOIN_ROOM).subscribe(({ io, client, data }) => {
  logInfo(`Client ${client.id} joins room ${data.room} as ${data.username}`);

  // Add user to the room
  // TODO: Make sure that user is only in one room!
  const allSockets = io.sockets.sockets as { [id: string]: ExtendedSocket };
  allSockets[client.id].username = data.username;
  allSockets[client.id].room = data.room;
  client.join(data.room);

  // Check if game already exists, if not -> create new game and set admin
  gameManager.createOrJoinGame(data.room, client.id, data.username);

  // Send new user list to all users
  io.in(data.room).emit(SocketEventNames.UPDATE_ROOM_USERS, gameManager.getUsersFromGame(client.room));

  // Send current game state to new connect client
  client.emit(SocketEventNames.UPDATE_GAME_STATE, gameManager.getGameState(data.room));
});

listenOnConnect<void>(SocketEventNames.INITIATE_GAME).subscribe(({ io, client }) => {
  try {
    gameManager.startGame(client.room, client.id);
    logInfo(`Starting game in room ${client.room}`);
    io.in(client.room).emit(SocketEventNames.UPDATE_GAME_STATE, gameManager.getGameState(client.room));
  } catch (err) {
    logWarning(`Unauthorized request!`);
  }
});

listenOnConnect<string>(SocketEventNames.SUBMIT_WORD)
  .subscribe(({ io, client, data }) => {
    logInfo(`Player ${client.username} submitted word ${data} in room ${client.room}`);
    gameManager.submitWordForPlayer(client.room, client.username, data);
    io.in(client.room).emit(SocketEventNames.UPDATE_GAME_STATE, gameManager.getGameState(client.room));
  });
