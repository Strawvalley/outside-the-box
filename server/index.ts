import { server } from "./server";
import { connection$, disconnect$, listenOnConnect, ExtendedSocket } from "./connection";
import { GameManager } from "./game_manager";

// Create HTTP server with "app" as handler
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`[INFO] Listening on port: ${port}`));

const gameManager = new GameManager();

connection$.subscribe(({ io, client }) => {
  console.log(`[CONNECTED] Client ${client.id}`);
});

disconnect$.subscribe(({ io, client }) => {
  console.log(`[DISCONNECTED] Client ${client.id}`);

  if (client.room) {
    io.in(client.room).emit("user left room", {
      username: client.username,
      room: client.room,
      id: client.id
    });
    gameManager.removeUserFromGame(client.room, client.username, client.id);
  }

  if (gameManager.isGameRunning(client.room)) {
    io.in(client.room).emit("all users in room update", gameManager.getUsersFromGame(client.room));
    io.in(client.room).emit("update game state", gameManager.getGameState(client.room));
  }
});

listenOnConnect<{ username: string, room: string }>("room").subscribe(({ io, client, data }) => {
  console.log(`[INFO] Client ${client.id} joins room ${data.room} as ${data.username}`);

  // Add user to the room
  const allSockets = io.sockets.sockets as { [id: string]: ExtendedSocket };
  allSockets[client.id].username = data.username;
  allSockets[client.id].room = data.room;
  client.join(data.room);

  // Check if game already exists, if not -> create new game and set admin
  gameManager.createOrJoinGame(data.room, client.id, data.username);

  // Send new user list to all users
  io.in(data.room).emit("all users in room update", gameManager.getUsersFromGame(client.room));

  // Send current game state to new connect client
  client.emit("update game state", gameManager.getGameState(data.room));
});

listenOnConnect<void>("initiate game").subscribe(({ io, client }) => {
  try {
    gameManager.startGame(client.room, client.id);
    console.log(`[INFO] Starting game in room ${client.room}`);
    io.in(client.room).emit("update game state", gameManager.getGameState(client.room));
  } catch (err) {
    console.log(`[INFO] Unauthorized request!`);
  }
});

listenOnConnect<string>("player submits word")
  .subscribe(({ io, client, data }) => {
    console.log(`[INFO] Player ${client.username} submitted word ${data} in room ${client.room}`);
    gameManager.submitWordForPlayer(client.room, client.username, data);
    io.in(client.room).emit("update game state", gameManager.getGameState(client.room));
  });

