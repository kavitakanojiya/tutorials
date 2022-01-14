import React from 'react';
import Board from './Board';
import Counter from './Counter';
import '../../stylesheets/multiplayer/Game.css';

class Game extends React.Component {
  // ::CHANGED::
  constructor(props) {
    super(props);

    this.players = ['X', 'O'];
    let board = [[null, null, null], [null, null, null], [null, null, null]];
    // Add `outcome` to track number of wins and ties
    let outcome = { 'X': 0, 'O': 0, 'tie': 0 };
    this.state = { board: board, currentPlayer: null, message: null, outcome: outcome };
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

  // ::CHANGED::
  gameConcluded() {
    let message = null;
    const currentState = this.isCompleted();
    // Consider the latest outcome
    let outcome = this.state.outcome;

    if (currentState === 'X') {
      message = 'X wins!';
      outcome.X += 1; // Increment X wins
    } else if (currentState === 'O') {
      message = 'O wins!';
      outcome.O += 1; // Increment O wins
    } else if (currentState === 'tie') {
      message = 'It\'s a tie!';
      outcome.tie += 1; // Increment ties
    }

    // Returns the message as well as latest increments
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
      <Board board={this.state.board} movePlayer={this.move.bind(this)} />
    )
  }

  // ::CHANGED::
  move(row, column) {
    const nextPlayer = this.players.filter(player => player != this.state.currentPlayer)[0];
    let updatedboard = this.state.board;
    if (updatedboard[row][column] == null) {
      updatedboard[row][column] = nextPlayer;
      // Update outcome whenever a move is made
      let gameOutcome = this.gameConcluded();
      this.setState({ currentPlayer: nextPlayer, board: updatedboard, message: gameOutcome.message, outcome: gameOutcome.outcome });
    }
  }

  // ::ADDED::
  renderCounter() {
    // Counter component handles the specifics like UI and other flow related to no. of wins and ties
    return (
      <Counter outcome={this.state.outcome} />
    )
  }

  renderMessage() {
    return (
      <div className='conclusion'>
        Status: { this.state.message || '--' }
      </div>
    )
  }

  // ::CHANGED::
  render() {
    return (
      <div className='game'>
        { this.renderCounter() /* Render Counter component  */ }
        { this.renderMessage() }
        { this.load() }
      </div>
    )
  }
}

export default Game;
