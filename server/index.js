const server = require('./server')
const { connection$, disconnect$, listenOnConnect } = require('./connection')

// Create HTTP server with "app" as handler
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`listening on port: ${port}`));

connection$.subscribe(({ io, client }) => {
  console.log(`New connection: ${io.path()} client: ${client.id}`);
});

disconnect$.subscribe(client => {
  console.log(`Disconnect: ${client.id}`);
});

listenOnConnect('room')
  .subscribe(({ io, client, data }) => {
    console.log(`Client ${client.id} joins room ${data.room} as ${data.username}`);
    client.join(data.room);
    io.sockets.in(data.room).emit('user joined room', { username: data.username, room: data.room });
  });