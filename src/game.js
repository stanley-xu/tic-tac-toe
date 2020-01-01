import React, { Component } from 'react';
import Splitpane from './splitpane';
import Board from './board';
import HistorySidebar from './historysidebar';

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      playerIsX: true,
      stepNum: 0
    }
  }
  
  handleClick(idx) {
    // take history only until the specified step
    const history = this.state.history.slice(0, this.state.stepNum + 1);
    
    const current = history[history.length - 1];
    const squares = current.squares.slice();  // shallow copy

    // short circuit if winner was announced or square already filled
    if ( squares[idx] || checkWinner(squares) ) return;
    
    squares[idx] = this.state.playerIsX ? 'X' : 'O';
    this.setState({
      history: [ ...history, { squares: squares } ],
      playerIsX: !this.state.playerIsX,  // turn-taking
      stepNum: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNum: step,
      playerIsX: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNum];
    const winner = checkWinner(current.squares);

    let status;
    if ( winner ) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.state.playerIsX ? 'X' : 'O'}`;
    }

    return (
      <Splitpane
        left={
          <HistorySidebar
            history={history.slice(0, history.length - 1)}
            onClick={(i) => this.jumpTo(i)} />
        }
        right={
          <main className='main'>
            <div className='status'>{status}</div>
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}/>
          </main>
        } />
    );
  }
}

function checkWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for ( let sol of lines ) {
    const [a, b, c] = sol;
    if ( squares[a] && squares[a] === squares[b] && squares[a] === squares[c] )
      return squares[a];
  }
  return null;
}
