import React from 'react';
import Board from './Board';

class Game extends React.Component {
  // ::ADDED::
  constructor(props) {
    // 1. Merge the props
    super(props);

    // 2. Initialize the players
    this.players = ['X', '0'];
    // 3. Initialize empty board
    let board = [[null, null, null], [null, null, null], [null, null, null]];
    // 4. Maintain the board and the current player
    this.state = { board: board, currentPlayer: null };
  }

  // ::CHANGED::
  load() {
    // Board component accepts the current state of the board and `#move` function is piggybacked to the Cell component
    return (
      <Board board={this.state.board} movePlayer={this.move.bind(this)} />
    )
  }

  // ::ADDED:
  move(row, column) {
    // 1. Calculates the next player
    const nextPlayer = this.players.filter(player => player != this.state.currentPlayer)[0];
    let updatedboard = this.state.board;
    // 2. Updates the board when the current player marks the cell. Ensure the cell value is not overridden
    if (updatedboard[row][column] == null) {
      updatedboard[row][column] = nextPlayer;
      // 3. Update the game state with the updated board and the next player
      this.setState({ currentPlayer: nextPlayer, board: updatedboard });
    }
  }

  render() {
    return (
      <div className='game'>
        { this.load() }
      </div>
    )
  }
}

export default Game;
