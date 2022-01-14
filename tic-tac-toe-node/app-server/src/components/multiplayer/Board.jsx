import React from 'react';
import Cell from './Cell';
import '../../stylesheets/multiplayer/Board.css';

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = { board: props.board };
  }

  renderCells() {
    let rows = [];
    for (let row = 0; row < this.state.board.length; row++) {
      for (let column = 0; column < this.state.board.length; column++) {
        const position = this.toCellNumber(row, column);
        const value = this.state.board[row][column];
        rows.push(<Cell id={position} key={position} value={value} movePlayer={this.props.movePlayer.bind(this)} toGridPosition={this.toGridPosition.bind(this)} />);
      }
    }
    return rows;
  }

  toCellNumber(row, column) {
    return ((row * 3) + column);
  }

  toGridPosition(position) {
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
