import React from 'react';
import Cell from './Cell';
import '../../stylesheets/multiplayer/Board.css';

class Board extends React.Component {
  // ::ADDED::
  constructor(props) {
    // 1. Merge the props
    super(props);

    // 2. Maintain state of the board
    this.state = { board: props.board };
  }

  // ::CHANGED::
  renderCells() {
    let rows = [];
    // 1. Iterate over each cell in the grid, fill them with respective values or leave them empty
    for (let row = 0; row < this.state.board.length; row++) {
      for (let column = 0; column < this.state.board.length; column++) {
        const position = this.toCellNumber(row, column);
        const value = this.state.board[row][column];
        // 2. Cell component accepts value of the cell, `#movePlayer` function from Game component, and `#toGridPosition` function to calculate position in 2-D matrix
        rows.push(<Cell id={position} key={position} value={value} movePlayer={this.props.movePlayer.bind(this)} toGridPosition={this.toGridPosition.bind(this)} />);
      }
    }
    return rows;
  }

  toCellNumber(row, column) {
    return ((row * 3) + column);
  }

  // ::ADDED::
  toGridPosition(position) {
    // Convert cell number to the position in a 2-D matrix
    return [Math.floor(position/3), position%3];
  }

  render() {
    return (
      <div className='board'>
      { this.renderCells() }
      </div>
    )
  }
}

export default Board;
