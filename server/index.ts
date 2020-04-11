import { server } from "./server";
import { connection$, disconnect$, listenOnConnect, ExtendedSocket } from "./connection";
import { games, createNewGame } from "./game";
import { getAllUsersInRoom } from "./utils";

// Create HTTP server with "app" as handler
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`[INFO] Listening on port: ${port}`));

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
  }

  const allUsersInRoom = getAllUsersInRoom(io, client.room);

  if (allUsersInRoom.length === 0) {
    // If last player of room left, delete the game
    delete games[client.room];
  } else if (client.id === games[client.room].admin) {
    // If the admin left the game -> assign new admin and update users for all clients
    games[client.room].admin = allUsersInRoom[0].id;
    allUsersInRoom[0].isAdmin = true;
    io.in(client.room).emit("all users in room update", allUsersInRoom);
    io.in(client.room).emit("update game state", { gameState: games[client.room] });
  }
});

listenOnConnect<{ username: string, room: string }>("room").subscribe(({ io, client, data }) => {
  console.log(`[INFO] Client ${client.id} joins room ${data.room} as ${data.username}`);

  // Add user to the room
  const allSockets = io.sockets.sockets as {[id: string]: ExtendedSocket};
  allSockets[client.id].username = data.username;
  allSockets[client.id].room = data.room;
  client.join(data.room);

  // Send new user list to all users
  const allUsersInRoom = getAllUsersInRoom(io, data.room);
  io.in(data.room).emit("all users in room update", allUsersInRoom);

  // Check if game already exists, if not -> create new game and set admin
  const game = games[data.room] ? games[data.room] : createNewGame(data.room, client.id);

  // Send current game state to new connect client
  client.emit("update game state", { gameState: game });
});

listenOnConnect<void>("initiate game").subscribe(({ io, client }) => {
  const room = client.room;
  if (client.id === games[room].admin) {
    console.log(`[INFO] Starting game in room ${room}`);
    games[room].startGame();
    io.in(room).emit("update game state", { gameState: games[room] });
  } else {
    console.log(`[INFO] Unauthorized request!`);
  }
});
