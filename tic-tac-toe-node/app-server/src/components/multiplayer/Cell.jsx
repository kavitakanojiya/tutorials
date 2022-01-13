import React from 'react';
import '../../stylesheets/multiplayer/Cell.css';

class Cell extends React.Component {
  constructor(props) {
    super(props);
  }

  // ::ADDED::
  handleClick() {
    // When player marks the cell, board state has changed and should be updated
    const position = this.props.toGridPosition(this.props.id);
    this.props.movePlayer(position[0], position[1]);
  }

  // ::CHANGED::
  render() {
    // Bind click event with each cell
    return (
      <div className='cell' position={this.props.id} value={this.props.value} onClick={this.handleClick.bind(this)}>
        { this.props.value }
      </div>
    )
  }
}

export default Cell;
