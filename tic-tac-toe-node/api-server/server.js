// 1. Load libraries //
const express = require('express');
const http = require('http');
const cors = require('cors');

// 2. Load environment variables //
// 2.1 Read port from the command if at all provided
const port = process.env.PORT || 4000;

// :ADDED::
// Temp variables //
// NOTE: Creating single instance of game at a time //
let game = null;

// 3. Initialize web server //
// 3.1 create a new express application
let app = express();
// 3.2 Bind application with the http to receive and server requests
const server = http.createServer(app);

// 4. Add middlewares //
app.use(express.json());
app.use(cors());

// 4. Define web APIs //
// 4.1 API(#a): root path to confirm if the api server is working
app.get('/', function(request, response) {
  response.send("Welcome to the world of express APIs!")
});

// ::ADDED::
// 4.2 API(#b): create a room
app.post('/multiplayer/createRoom', function(request, response) {
  const currentTime = (new Date()).getTime();
  const roomId = 'X-' + currentTime;
  game = request.body['game'];
  response.json({ 'roomId': roomId });
});

// ::ADDED::
// 4.3 API(#b): join a room
app.post('/multiplayer/joinRoom', function(request, response) {
  player = request.body['game'].players[0];
  game.players.push(player);
  let json_resp = { roomId: request.body.roomId, game: game };
  response.json(json_resp);
});

// 5. Start the express server //
server.listen(port, function() {
  console.log((new Date()) + ' Server is listening on port ' + port);
});
