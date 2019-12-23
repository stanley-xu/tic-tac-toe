import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square"
      onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
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

class Game extends React.Component {
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
    console.log(`0-${this.state.stepNum}`, this.state.history);
    
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    // stop if winner was announced or square already filled
    if ( squares[idx] || checkWinner(squares) ) return;
    
    squares[idx] = this.state.playerIsX ? 'X' : 'O';
    this.setState({
      history: [ ...history, { squares: squares } ],
      playerIsX: !this.state.playerIsX,  // negate player at the end of each turn
      stepNum: history.length,
    });
    console.log(`0-${this.state.stepNum}`, this.state.history);
    
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

    const moves = history.map((step, move) => {
      const desc = move ? `Go to move ${move}` : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    let status;
    if ( winner === null )
      status = `Next player: ${this.state.playerIsX ? 'X' : 'O'}`;
    else
      status = `Winner: ${winner}`;

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
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

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

