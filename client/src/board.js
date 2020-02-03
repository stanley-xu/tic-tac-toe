import React, { Component } from 'react';
import Square from './square';

export default class Board extends Component {
  // helper routine for rendering squares
  // - pass state: `value`
  // - pass "accessor" to modify parent `Board` state: `handleClick`
  renderSquare(i) {
    return (
      <Square key={i} id={`sq-${i}`}
        win={this.props.winningLine?.includes(i) ? 'win' : ''}
        previewStyle={this.props.previewStyle}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let rows = [];
    
    for ( let i = 0; i < 3; i += 1 ) {
      let children = [];
      for ( let j = i * 3; j < i * 3 + 3; j += 1 ) {
        children.push(this.renderSquare(j));
      }
      rows.push(
        <div key={i} className='board-row'>{children}</div>
      );
    }

    return (
      <div className='board'>
        {rows}
      </div>
    );
  }
}
