import React from 'react';
import '../../stylesheets/multiplayer/Cell.css';

class Cell extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick() {
    const position = this.props.toGridPosition(this.props.id);
    this.props.movePlayer(position[0], position[1]);
  }

  render() {
    return (
      <div className='cell' position={this.props.id} value={this.props.value} onClick={this.handleClick.bind(this)}>
        { this.props.value }
      </div>
    )
  }
}

export default Cell;
