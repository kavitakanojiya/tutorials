// 1. Load libraries //
const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIO = require('socket.io');

// 2. Load environment variables //
// 2.1 Read port from the command if at all provided
const port = process.env.PORT || 4000;
// 2.2 Since requests are coming in from the different host, app server's url has to be whitelisted while initializing websocket
const allowedOrigins = "http://localhost:* http://127.0.0.1:* localhost:* 127.0.0.1:*";

// Temp variables //
// NOTE: Creating single instance of game at a time //
let game = null;

// 3. Initialize web server //
// 3.1 create a new express application
let app = express();
// 3.2 Bind application with the http to receive and server requests
const server = http.createServer(app);
// ::ADDED::
// 3.3 Register websocket protocol to the server
let io = socketIO(server, { 'origins': allowedOrigins, 'transports': ['websocket'] });

// 4. Add middlewares //
app.use(express.json());
app.use(cors());

// 4. Define web APIs //
// 4.1 API(#a): root path to confirm if the api server is working
app.get('/', function(request, response) {
  response.send("Welcome to the world of express APIs!")
});

// 4.2 API(#b): create a room
app.post('/multiplayer/createRoom', function(request, response) {
  const currentTime = (new Date()).getTime();
  const roomId = 'X-' + currentTime;
  game = request.body['game'];
  response.json({ 'roomId': roomId });
});

// 4.3 API(#b): join a room
app.post('/multiplayer/joinRoom', function(request, response) {
  const player = request.body['game'].players[0];
  game.players.push(player);
  let json_resp = { roomId: request.body.roomId, game: game };
  response.json(json_resp);
});

// ::CHANGED::
// 5. Define websocket APIs //
io.on('connection', (socket) => {
  console.log('New user connected');

  // a. Create a socket connection by roomId but it does not emit updates as the other player hasn't joined yet.
  socket.on('createRoom', (currentGame, roomId) => {
    console.log('Creating a room');
    socket.join(roomId);
  });

  // b. Join the socket with roomId and emit updates to X
  socket.on('joinRoom', (currentGame, roomId) => {
    console.log('Joining a room');
    socket.join(roomId);

    // b.1 Emitting updates to X & O.
    console.log('Emitting to roomId:', roomId);
    io.emit(roomId, game);

    // b.2 Start the game
    // NOTE: We could merged b.1 & b.2 and it would work fine.
    console.log('Starting the game');
    io.emit('startGame:' + roomId);
  });

  // New event `play`
  socket.on('play', (currentGame, roomId) => {
    console.log('Playing...');
    game = currentGame;

    // emit events to both X & O
    socket.broadcast.emit(roomId, game);
  });

  // Restart event `restart` added
  socket.on('restart', (currentGame, roomId) => {
    console.log('Restarting...');
    game = currentGame;

    io.emit('restartGame:' + roomId, game);
  });
});

// 6. Start the express server //
server.listen(port, function() {
  console.log((new Date()) + ' Server is listening on port ' + port);
});
