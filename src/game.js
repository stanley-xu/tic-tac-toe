import React, { Component } from 'react';
import {
  PLAY_MODE, isTerminal, checkWinner, AIPlayer
} from './gameplay';
import Splitpane from './splitpane';
import Board from './board';
import HistorySidebar from './historysidebar';
import { Toggle, Restart, PlayMode } from './controls'

// TODO: write tests--this one tests a trap setup by X
// const test = [
//   'O', 'O', 'X', 'X', null, 'O', null, null, 'X'
// ];

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
      playMode: PLAY_MODE.ai,
    }
  }

  handleClick(idx) {
    // take history only until the specified step
    const history = this.state.history.slice(0, this.state.stepNum + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();  // shallow copy

    // ignore click if square already clicked or game won
    if ( squares[idx] || this.state.winningLine ) return;
    
    // do move by filling square
    squares[idx] = this.state.playerIsX ? 'X' : 'O';
    let line = checkWinner(squares)?.line;

    // make AI moves if playing AI and game not won yet
    if ( this.state.playMode === PLAY_MODE.ai && !line ) {
      this.doAIMove(squares);
      line = checkWinner(squares)?.line;
    }
    
    // update state
    this.setState({
      history: [ ...history, { squares: squares } ],
      playerIsX: this.state.playMode === PLAY_MODE.ai ?
        true : !this.state.playerIsX,  // turn-taking
      stepNum: history.length,
      winningLine: line,
    });
  }

  doAIMove(squares) {
    // clear any existing main board styling
    const elems = document.querySelectorAll(`.square:not(.preview)`);
    elems.forEach(s => s.className = 'square');

    const { move } = AIPlayer.search(squares);
    if ( move == null ) return; // no best move (game ended in a draw?)
    
    // highlight recommended move
    const sq = document.querySelector(`#sq-${move}:not(.preview)`);
    sq.className += ' recommended';
    
    squares[move] = 'O';
  }

  jumpTo(step) {
    this.setState({
      stepNum: step,
      playerIsX: this.state.playMode === PLAY_MODE.ai ?
        true : (step % 2) === 0,
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
      playerIsX: this.state.playMode === PLAY_MODE.ai ?
        true : !this.state.playerIsX,
      winningLine: null,
    });
  }

  handleModeChange(event) {
    let newGame = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNum: 0,
      winningLine: null,
      playMode: event.target.value,
    };
    if ( event.target.value === PLAY_MODE.ai )
      newGame['playerIsX'] = true;

    this.setState(newGame);
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
              onChange={(e) => this.handleModeChange(e)} />
          </main>
        } />
    );
  }
}
