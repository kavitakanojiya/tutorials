import React from 'react';
import { Button, TextField } from '@mui/material';
import Game from './Game';
import '../../stylesheets/multiplayer/Room.css';

const axios = require('axios');
const apiUrl = `http://${process.env.WDS_SOCKET_HOST}:${process.env.WDS_SOCKET_PORT}`;

class Room extends React.Component {
  // ::CHANGED::
  constructor(props) {
    super(props);

    // Establish the contract of "game" object as we will be transmitting the current state between the players over network
    this.game = this.initializeGame();
    // Room will have 2 states:
    // 1. `initialized`: used to show options i.e. create or join a room
    // 2. `created`: used when player a created or joined a room and show them the matrix

    // #room.id: Each room will be identified by unique identifier
    // #room.token: Holds value only when a player joins the room using room Id
    // #game: game is the initialized state when a room is created and we will be used/updated throughout the space
    // #playerInstance: identifies which player it is i.e. X & O. This will help players to play alternatively
    this.state = { roomState: 'initialized', room: { id: null, token: null }, game: this.game, playerInstance: null };
  }

  createRoom() {
    // Lets consider X is the first player who creates a room
    let player_X = { identifier: 'X' };
    // Update `game` with the player
    this.game.players.push(player_X);

    // Register `game` on the api-server
    axios.post(`${apiUrl}/multiplayer/createRoom`, { game: this.game })
    .then(response => {
      // Update the current state of the room
      this.setState({ roomState: 'created', room: { id: response.data.roomId }, game: this.game, playerInstance: player_X });
    })
    .catch(error => {
      console.log(error);
    })
    .then(() => {
      // do something
    });
  }

  display() {
    // :initialized state with display the options to either create a room or to join one
    // :created state switch the UI to display 3x3 matrix
    if (this.state.roomState === 'initialized') {
      return this.renderOptions();
    } else if (this.state.roomState === 'created') {
      return (
        <Game roomId={this.state.room.id} game={this.state.game} playerInstance={this.state.playerInstance} />
      )
    }
  }

  // ::ADDED::
  handleChange() {
    // Existing room config
    let room = this.state.room;
    // Update the token with the entered room ID
    room['token'] = event.target.value;
    // Update the state of the room
    this.setState({ room: room });
  }

  initializeGame() {
    // Default contract of the game that will be transmitted between players over the network.
    // Further, any changes in the game object should be consistent with this contract.
    let game = {
      'players': [],
      'board': [[null, null, null], [null, null, null], [null, null, null]],
      'currentPlayer': null,
      'winner': null,
      'state': null,
      'outcome': { 'X': 0, 'O': 0, 'tie': 0  }
    }

    return game;
  }

  // ::ADDED::
  joinRoom() {
    let player_O = { identifier: 'O' };
    this.game.players.push(player_O);

    // Register `game` on the api-server
    axios.post(`${apiUrl}/multiplayer/joinRoom`, { roomId: this.state.room.token, game: this.game })
    .then(response => {
      // Update the current state of the room
      console.log('response:', response)
      this.setState({ roomState: 'created', room: { id: response.data.roomId }, game: response.data.game, playerInstance: player_O });
    })
    .catch(error => {
      console.log(error);
    })
    .then(() => {
      // do something
    });
  }

  renderOptions() {
    // Option #1: Create a room
    // Option #2: Join a room
    return (
      <div className='roomOptions'>
        <div className='createRoom'>
          <Button variant='contained' onClick={this.createRoom.bind(this)}>Create</Button>
        </div>
        <div className='or'>OR</div>
        <div className='joinRoom'>
          <TextField id="outlined-basic" className="room-id-input" label="Enter room ID" variant="standard" onChange={this.handleChange.bind(this)} style={{marginTop: '-12px'}}/>
          <Button variant='outlined' onClick={this.joinRoom.bind(this)}>Join</Button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className='room'>
        { this.display() }
      </div>
    )
  }
}

export default Room;