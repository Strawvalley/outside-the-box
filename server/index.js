const server = require('./server')
const { connection$, disconnect$, listenOnConnect } = require('./connection')

// Create HTTP server with "app" as handler
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`listening on port: ${port}`));

const games = {};

connection$.subscribe(({ io, client }) => {
  console.log(`[CONNECTED] Client ${client.id}`);
});

disconnect$.subscribe(({io, client}) => {
  console.log(`[DISCONNECTED] Client ${client.id}`);

  if (client.room) {
    io
      .in(client.room)
      .emit('user left room', { username: client.username, room: client.room, id: client.id });
  }

  const allSockets = io.sockets.sockets;
  const allUsersInRoom = Object.entries(allSockets)
    .map(([ id, socket ]) => ({ id, username: socket.username, room: socket.room }))
    .filter(({id, username, room}) => room === client.room);

  if (allUsersInRoom.length === 0) {
    delete games[client.room];
  } else if (client.id === games[client.room].admin) {
    games[client.room].admin = allUsersInRoom[0].id;
    io.in(client.room).emit('update game state', { gameState: games[client.room] });
  }
});

listenOnConnect('room')
  .subscribe(({ io, client, data }) => {
    console.log(`[INFO] Client ${client.id} joins room ${data.room} as ${data.username}`);

    const allSockets = io.sockets.sockets;

    const allUsersInRoom = Object.entries(allSockets)
      .map(([ id, socket ]) => ({ id, username: socket.username, room: socket.room }))
      .filter(({id, username, room}) => room === data.room);

    client.emit('all users in room', allUsersInRoom);

    allSockets[client.id].username = data.username;
    allSockets[client.id].room = data.room;

    client.join(data.room);

    if (!games[data.room]) {
      games[data.room] =  {
        started: false,
        admin: client.id,
        activePlayer: undefined,
        totalRounds: 10,
        round: 1,
        points: 0,
        secondsLeft: 30,
        state: 'not-started' // 'not-started' | 'thinking' | 'guessing' | 'round-finished' | 'game-finished'
      }
    }

    io.sockets
      .in(data.room)
      .emit('user joined room', { username: data.username, room: data.room, id: client.id });

    client.emit('update game state', { gameState: games[data.room] });
  });

listenOnConnect('start game')
  .subscribe(({ io, client }) => {

  });

