// 1. Load libraries //
const express = require('express');
const http = require('http');

// 2. Load environment variables //
// 2.1 Read port from the command if at all provided
const port = process.env.PORT || 4000;

// 3. Initialize web server //
// 3.1 create a new express application
let app = express();
// 3.2 Bind application with the http to receive and server requests
const server = http.createServer(app);

// 4. Add middlewares //
app.use(express.json());

// 4. Define web APIs //
// 4.1 API(#a): root path to confirm if the api server is working
app.get('/', function(request, response) {
  response.send("Welcome to the world of express APIs!")
});


// 5. Start the express server //
server.listen(port, function() {
  console.log((new Date()) + ' Server is listening on port ' + port);
});
