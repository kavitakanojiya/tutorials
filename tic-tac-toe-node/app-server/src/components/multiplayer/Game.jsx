import React from 'react';
import Board from './Board';
import Counter from './Counter';
// ::ADDED::
import { Button } from '@mui/material'; /* Import Button component from material UI */
import '../../stylesheets/multiplayer/Game.css';

class Game extends React.Component {
  // ::CHANGED::
  constructor(props) {
    super(props);

    this.players = ['X', 'O'];
    let board = [[null, null, null], [null, null, null], [null, null, null]];
    let outcome = { 'X': 0, 'O': 0, 'tie': 0 };
    // Introduce game_state to track the state of the game i.e. started, completed, etc.
    // TODO: We will revisit to enhance this.
    this.state = { game_state: 'started', board: board, currentPlayer: null, message: null, outcome: outcome };
  }

  // ::ADDED::
  componentDidUpdate(prevProps, prevState) {
    // Mark the game completed if its a tie or any player wins else skip.
    if (this.state.game_state === 'started') {
      if (this.isCompleted()) {
        // Update outcome that tracks the number of wins and ties.
        let gameOutcome = this.gameConcluded();
        this.setState({ game_state: 'completed', outcome: gameOutcome.outcome, message: gameOutcome.message });
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

  // ::CHANGED::
  load() {
    return (
      <div className='board-block'>
        <Board board={this.state.board} movePlayer={this.move.bind(this)} />
      </div>
    )
  }

  move(row, column) {
    const nextPlayer = this.players.filter(player => player != this.state.currentPlayer)[0];
    let updatedboard = this.state.board;
    if (updatedboard[row][column] == null) {
      updatedboard[row][column] = nextPlayer;
      // Now, disable this. We will update outcome when the game has completed
      // let gameOutcome = this.gameConcluded();
      // this.setState({ currentPlayer: nextPlayer, board: updatedboard, message: gameOutcome.message, outcome: gameOutcome.outcome });
      this.setState({ currentPlayer: nextPlayer, board: updatedboard });
    }
  }

  renderCounter() {
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

  // ::ADDED::
  renderRestartButton() {
    if (this.state.game_state !== 'completed') {
      return null;
    }

    return (
      <div className='restart'>
        <Button variant="contained" onClick={this.restart.bind(this)}>Restart</Button>
      </div>
    )
  }

  // ::CHANGED::
  render() {
    return (
      <div className='game'>
        { this.renderCounter() }
        { this.renderMessage() }
        { this.load() }
        { this.renderRestartButton() /* Let's restart the game so that players play continuously */ }
      </div>
    )
  }

  // ::ADDED::
  restart() {
    // Reset the board
    let board = [[null, null, null], [null, null, null], [null, null, null]];
    // Capture the outcome of the game so far
    let outcome = this.state.outcome;
    // Reset the attributes
    this.setState({ game_state: 'started', board: board, currentPlayer: null, message: null, outcome: outcome });
  }
}

export default Game;
