import React from 'react';
import '../../stylesheets/multiplayer/Counter.css';

class Counter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='counter'>
        <div className='x-counter'>
          <span>X: {this.props.outcome.X}</span>
        </div>

        <div className='o-counter'>
          <span>O: {this.props.outcome.O}</span>
        </div>

        <div className='tie-counter'>
          <span>Ties: {this.props.outcome.tie}</span>
        </div>
      </div>
    )
  }
}

export default Counter;
