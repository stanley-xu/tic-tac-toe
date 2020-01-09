import React, { Component } from 'react';
import { isTerminal, checkWinner, AIPlayer } from './gameplay';
import Splitpane from './splitpane';
import Board from './board';
import HistorySidebar from './historysidebar';
import { Toggle, Restart, PlayMode } from './controls'

export const GAME_MODE =  { ai: 'ai', human: 'human' };

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
      playMode: GAME_MODE.ai,
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

    // make AI moves
    if ( this.state.playMode === GAME_MODE.ai ) {
      if ( line ) return; // AI has lost
      const bestMove = AIPlayer.search(squares).move;
      
      // clear any existing main board styling
      const elems = document.querySelectorAll(`.square:not(.preview)`);
      elems.forEach(s => s.className = 'square');

      if ( bestMove == null ) return;
      // highlight recommended move
      const sq = document.querySelector(`#sq-${bestMove}:not(.preview)`);
      sq.className += ' recommended';
      // TODO: have the AI make the move
    }
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

  handleChange(event) {
    this.setState({ playMode: event.target.value });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNum];

    let status;
    if ( isTerminal(current.squares) ) {
      const result = checkWinner(current.squares);
      status = result ? `Winner: ${result.winner}` : 'Draw';
    } else {
      status = `Next player: ${this.state.playerIsX ? 'X' : 'O'}`;
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
            <PlayMode 
              value={this.state.playMode}
              onChange={(e) => this.handleChange(e)} />
          </main>
        } />
    );
  }
}
