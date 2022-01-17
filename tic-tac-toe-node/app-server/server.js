// Load libraries //
const express = require('express');
const path = require('path');
const app = express();

// Load environment variables //
const port = process.env.PORT || 9000;
const environment = process.env.NODE_ENV || 'development';

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, function() {
  console.log((new Date()) + ' Server is listening on port ' + port);
});
