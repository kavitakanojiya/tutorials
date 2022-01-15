import React from 'react';
import Board from './Board';
import Counter from './Counter';
import { Button } from '@mui/material';
import '../../stylesheets/multiplayer/Game.css';

class Game extends React.Component {
  // ::CHANGED::
  constructor(props) {
    super(props);

    this.players = ['X', 'O'];
    this.roomId = props.roomId; // Retain room information
    // A game will have 2 states:
    // 1. `initialized`: when the first player has joined and the other is yet to join.
    // 2. `started`: when both X & O have joined
    // 3. `completed`: when the game has a tie or either of the player has won

    // #game: game is the initialized state when a room is created and we will be used/updated throughout the space
    // #board: current state of the board when move is made
    // #currentPlayer: alternate player information
    // #message: has text as `X wins!` or `It's a tie`
    // #outcome: tracks number of wins and ties
    // #playerInstance: current logged in player
    console.log(props.game)
    this.state = { gameState: 'initialized', game: props.game, board: props.game.board, currentPlayer: null, message: null, outcome: props.game.outcome, playerInstance: props.playerInstance };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.gameState === 'started') {
      if (this.isCompleted()) {
        let gameOutcome = this.gameConcluded();
        this.setState({ gameState: 'completed', outcome: gameOutcome.outcome, message: gameOutcome.message });
      }
    }
  }

  emptyCells() {
    let cells = [];
    const currentBoard = this.state.board;

    for (let row = 0; row < currentBoard.length; row++) {
      for (let column = 0; column < currentBoard.length; column++) {
        if (currentBoard[row][column] == null) {
          cells.push([row, column])
        }
      }
    }

    return cells;
  }

  gameConcluded() {
    let message = null;
    const currentState = this.isCompleted();
    let outcome = this.state.outcome;

    if (currentState === 'X') {
      message = 'X wins!';
      outcome.X += 1;
    } else if (currentState === 'O') {
      message = 'O wins!';
      outcome.O += 1;
    } else if (currentState === 'tie') {
      message = 'It\'s a tie!';
      outcome.tie += 1;
    }

    return { message: message, outcome: outcome };
  }

  isCompleted() {
    let winner = null;
    const currentBoard = this.state.board;

    for (let row = 0; row < currentBoard.length; row++) {
      if ((currentBoard[row][0] !== null) && ((currentBoard[row][0] === currentBoard[row][1]) && (currentBoard[row][1] === currentBoard[row][2]))) {
        winner = currentBoard[row][0]
      }
    }

    for (let column = 0; column < currentBoard.length; column++) {
      if ((currentBoard[0][column] !== null) && ((currentBoard[0][column] === currentBoard[1][column]) && (currentBoard[1][column] === currentBoard[2][column]))) {
        winner = currentBoard[0][column]
      }
    }

    if ((currentBoard[0][0] !== null) && ((currentBoard[0][0] === currentBoard[1][1]) && (currentBoard[1][1] === currentBoard[2][2]))) {
      winner = currentBoard[0][0]
    }

    if ((currentBoard[0][2] !== null) && ((currentBoard[0][2] === currentBoard[1][1]) && (currentBoard[1][1] === currentBoard[2][0]))) {
      winner = currentBoard[0][2]
    }

    let openPositions = 0
    openPositions += this.emptyCells().length

    if ((openPositions === 0) && (winner === null)) {
      return 'tie'
    } else {
      return winner
    }
  }

  load() {
    return (
      <div className='board-block'>
        <Board board={this.state.board} movePlayer={this.move.bind(this)} />
      </div>
    )
  }

  move(row, column) {
    const nextPlayer = this.players.filter(player => player !== this.state.currentPlayer)[0];
    let updatedboard = this.state.board;
    if (updatedboard[row][column] == null) {
      updatedboard[row][column] = nextPlayer;
      this.setState({ currentPlayer: nextPlayer, board: updatedboard });
    }
  }

  renderCounter() {
    return (
      <Counter outcome={this.state.outcome} />
    )
  }

  renderMessage() {
    // Skip unless both of the players have joined
    if (this.state.gameState === 'initialized') {
      return;
    }

    return (
      <div className='conclusion'>
        Status: { this.state.message || '--' }
      </div>
    )
  }

  renderRestartButton() {
    if (this.state.gameState !== 'completed') {
      return null;
    }

    return (
      <div className='restart'>
        <Button variant="contained" onClick={this.restart.bind(this)}>Restart</Button>
      </div>
    )
  }

  render() {
    return (
      <div className='game'>
        { this.renderCounter() }
        { this.roomInfo() /* Render room information */ }
        { this.renderMessage() }
        { this.load() }
        { this.renderRestartButton() }
      </div>
    )
  }

  restart() {
    let board = [[null, null, null], [null, null, null], [null, null, null]];
    let outcome = this.state.outcome;
    this.setState({ gameState: 'started', board: board, currentPlayer: null, message: null, outcome: outcome });
  }

  roomInfo() {
    // Display room Id as well as an text for the player to know that the other player is yet to join
    return (
      <div className='roomInfo'>
        <div>Room ID: {this.props.roomId}</div>
        {(this.state.gameState === 'initialized') && (<div>Waiting for the other player to join...</div>)}
      </div>
    )
  }
}

export default Game;
