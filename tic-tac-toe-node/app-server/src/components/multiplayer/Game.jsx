import React from 'react';
import Board from './Board';
import '../../stylesheets/multiplayer/Game.css';

class Game extends React.Component {
  // ::Changed::
  constructor(props) {
    super(props);

    this.players = ['X', 'O'];
    let board = [[null, null, null], [null, null, null], [null, null, null]];
    // Add `message` to track the win or tie
    this.state = { board: board, currentPlayer: null, message: null };
  }

  // ::ADDED::
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

  // ::ADDED::
  gameConcluded() {
    let message = null;
    const currentState = this.isCompleted();

    if (currentState === 'X') {
      message = 'X wins!';      
    } else if (currentState === 'O') {
      message = 'O wins';
    } else if (currentState === 'tie') {
      message = 'It\'s a tie!'
    }

    return message;
  }

  // ::ADDED::
  isCompleted() {
    let winner = null;
    const currentBoard = this.state.board;

    // 1. Horizontal when elements are same
    for (let row = 0; row < currentBoard.length; row++) {
      if ((currentBoard[row][0] !== null) && ((currentBoard[row][0] === currentBoard[row][1]) && (currentBoard[row][1] === currentBoard[row][2]))) {
        winner = currentBoard[row][0]
      }
    }

    // 2. Vertical when elements are same
    for (let column = 0; column < currentBoard.length; column++) {
      if ((currentBoard[0][column] !== null) && ((currentBoard[0][column] === currentBoard[1][column]) && (currentBoard[1][column] === currentBoard[2][column]))) {
        winner = currentBoard[0][column]
      }
    }

    // 3. Diagonal: top-left to bottom-right
    if ((currentBoard[0][0] !== null) && ((currentBoard[0][0] === currentBoard[1][1]) && (currentBoard[1][1] === currentBoard[2][2]))) {
      winner = currentBoard[0][0]
    }

    // 4. Diagonal: top-right to bottom-left
    if ((currentBoard[0][2] !== null) && ((currentBoard[0][2] === currentBoard[1][1]) && (currentBoard[1][1] === currentBoard[2][0]))) {
      winner = currentBoard[0][2]
    }

    // 5. evaluate any open positions left
    let openPositions = 0
    openPositions += this.emptyCells().length

    // 6. If no positions left, then it is a tie
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

  move(row, column) {
    const nextPlayer = this.players.filter(player => player != this.state.currentPlayer)[0];
    let updatedboard = this.state.board;
    if (updatedboard[row][column] == null) {
      updatedboard[row][column] = nextPlayer;
      this.setState({ currentPlayer: nextPlayer, board: updatedboard, message: this.gameConcluded() });
    }
  }

  // ::ADDED::
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
      { this.renderMessage() }
      { this.load() }
      </div>
    )
  }
}

export default Game;
