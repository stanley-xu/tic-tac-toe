import React, { Component } from 'react';
import Splitpane from './splitpane';
import Board from './board';
import HistorySidebar from './historysidebar';
import { Toggle, Restart } from './controls'

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      playerIsX: true,
      stepNum: 0,
      sortRecent: true,
      winningLine: null,
    }
  }
  
  handleClick(idx) {
    // take history only until the specified step
    const history = this.state.history.slice(0, this.state.stepNum + 1);
    
    const current = history[history.length - 1];
    const squares = current.squares.slice();  // shallow copy

    // short circuit if winner was announced or square already filled
    if ( squares[idx] || this.state.winningLine ) return;
    
    // do move by filling square
    squares[idx] = this.state.playerIsX ? 'X' : 'O';
    
    // update
    const line = checkWinner(squares)?.line;
    this.setState({
      history: [ ...history, { squares: squares } ],
      playerIsX: !this.state.playerIsX,  // turn-taking
      stepNum: history.length,
      winningLine: line,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNum: step,
      playerIsX: (step % 2) === 0,
      winningLine: null,
    })
  }

  handleToggle() {
    this.setState({
      sortRecent: !this.state.sortRecent
    });
  }

  handleRestart() {
    this.setState({
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNum: 0,
      playerIsX: !this.state.playerIsX,
      winningLine: null,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNum];
    const result = checkWinner(current.squares);

    let status;
    if ( result ) {
      status = `Winner: ${result.winner}`;
    } else {
      if ( current.squares.includes(null) ) {
        status = `Next player: ${this.state.playerIsX ? 'X' : 'O'}`;
      } else {
        status = 'Draw'
      }
    }

    return (
      <Splitpane
        left={
          <HistorySidebar
            history={history.slice(0, history.length - 1)}
            reversed={this.state.sortRecent}
            onClick={(i) => this.jumpTo(i)} />
        }
        right={
          <main className='main'>
            <div className='status'>{status}</div>
            <Board
              squares={current.squares}
              winningLine={this.state.winningLine}
              onClick={(i) => this.handleClick(i)} />
            <Toggle
              onClick={() => this.handleToggle()}
              sortRecent={this.state.sortRecent} />
            <Restart
              onClick={() => this.handleRestart()} />
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
    if ( squares[a] && squares[a] === squares[b] && squares[a] === squares[c] ) {
      return {
        winner: squares[a],
        line: [a, b, c],
      };
    }
  }
  return null;
}
