import { server } from "./server";
import { connection$, disconnect$, listenOnConnect } from "./connection";

// Create HTTP server with "app" as handler
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`[INFO] Listening on port: ${port}`));

const games = {};

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
    delete games[client.room];
  } else if (client.id === games[client.room].admin) {
    games[client.room].admin = allUsersInRoom[0].id;
    allUsersInRoom[0].isAdmin = true;
    io.in(client.room).emit("all users in room update", allUsersInRoom);
    io.in(client.room).emit("update game state", { gameState: games[client.room] });
  }
});

listenOnConnect("room").subscribe(({ io, client, data }) => {
  console.log(`[INFO] Client ${client.id} joins room ${data.room} as ${data.username}`);

  // Check if game already exists, if not -> create new game and set admin
  if (!games[data.room]) {
    games[data.room] = {
      started: false,
      admin: client.id,
      activePlayer: undefined,
      totalRounds: 10,
      round: 1,
      points: 0,
      secondsLeft: 5,
      state: "not-started" // 'not-started' | 'thinking' | 'guessing' | 'round-finished' | 'game-finished'
    };
  }

  const allSockets = io.sockets.sockets;
  allSockets[client.id].username = data.username;
  allSockets[client.id].room = data.room;
  client.join(data.room);

  const allUsersInRoom = getAllUsersInRoom(io, data.room);

  // Send new user list to all users
  io.in(data.room).emit("all users in room update", allUsersInRoom);

  // Send current game state to new connect client
  client.emit("update game state", { gameState: games[data.room] });
});

listenOnConnect("initiate game").subscribe(({ io, client }) => {
  const room = client.room;
  if (client.id === games[room].admin) {
    console.log(`Starting game in room ${room}`);

    games[room].started = true;
    games[room].state = 'thinking';

    io.in(room).emit("update game state", { gameState: games[room] });
  } else {
    console.log(`Unauthorized request!`);
  }
});

interface user {
  id: string,
  username: string,
  room: string,
  isAdmin: boolean
}

function getAllUsersInRoom(io, roomName: string): user[] {
  const allSockets = io.sockets.sockets;
  return Object.entries(allSockets)
    .map(([id, socket]: [any, any]) => ({
      id,
      username: socket.username,
      room: socket.room,
      isAdmin: games[socket.room] ? id === games[socket.room].admin : false
    }))
    .filter(({ room }) => room === roomName);
}
