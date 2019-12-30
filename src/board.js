import React, { Component } from 'react';
import Square from './square';

export default class Board extends Component {
  // helper routine for rendering squares
  // - pass state: `value`
  // - pass "accessor" to modify parent `Board` state: `handleClick`
  renderSquare(i) {
    return (
    <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />
    );
  }

  render() {
    console.log(`Rendering board with squares`, this.props.squares);
    
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
