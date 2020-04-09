const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected');
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log('listening on *:' + port);
});


