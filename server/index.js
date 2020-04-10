const server = require('./server')
const { connection$, disconnect$, listenOnConnect } = require('./connection')

// Create HTTP server with "app" as handler
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`listening on port: ${port}`));

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
});

listenOnConnect('room')
  .subscribe(({ io, client, data }) => {
    console.log(`[INFO] Client ${client.id} joins room ${data.room} as ${data.username}`);

    const allSockets = io.sockets.sockets;

    const allUsers = Object.entries(allSockets)
      .map(([ id, socket ]) => ({ id, username: socket.username, room: socket.room }))
      .filter(({id, username, room}) => room === data.room);

    client.emit('all users in room', allUsers);

    allSockets[client.id].username = data.username;
    allSockets[client.id].room = data.room;

    client.join(data.room);

    io.sockets
      .in(data.room)
      .emit('user joined room', { username: data.username, room: data.room, id: client.id });
  });
