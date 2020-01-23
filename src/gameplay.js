/**
 * Minimax search conventions
 * - Start with MAX player
 * - Utilities: win = 1, draw = 0, lose = -1
 * - State: array of squares (array of strings)
 * - Move: indicies of square array (number)
*  - Transition model will slice whenever possible for immutability
 */

const PLAYERS = { ai: 'O', human: 'X' };
const PLAY_MODE = { ai: 'ai', human: 'human' };
const SEARCH_MODE = { max: 'MAX', min: 'MIN' };

const AIPlayer = {
  search: (squares) => minimax(squares, SEARCH_MODE.max),
};

// note: returns util of player MAX
function utility(state) {
  const result = checkWinner(state);
  const speedBonus = state.filter(v => v == null).length;
  
  let score = 0;
  if ( result === null ) score = 1; // if terminal => draw
  else if ( result.winner === PLAYERS.ai ) score = 1;
  else score = -1;

  return score * (1 + speedBonus);
}

function isTerminal(state) {
  return !state.includes(null) || checkWinner(state);
}

function transition(state, move, player) {
  const resultState = state.slice();
  resultState[move] = player;
  return resultState;
}

function minimax(state, mode) {
  // base case
  if ( isTerminal(state) ) {
    return {
      move: null,
      util: utility(state)
    };
  }
  
  // consider only blank squares to be valid moves
  const moves = state
  .map((square, idx) => ( square == null ) ? idx : -1)
  .filter(v => v !== -1);
  
  // find optimal minimax decision at the root
  let bestChoice = { move: null, util: null };
  moves.forEach(move => {
    // determine transition given move and player id
    const playerId = mode === SEARCH_MODE.max ? PLAYERS.ai : PLAYERS.human;
    const nextState = transition(state, move, playerId);

    // determine move utility via recursive minimax calls
    const moveUtil = mode === SEARCH_MODE.max ?
      minimax(nextState, SEARCH_MODE.min).util
      : minimax(nextState, SEARCH_MODE.max).util;

    // maintain the most optimal choice based on utility WRT the player in question
    let foundBetterChoice = false;
    if ( mode === SEARCH_MODE.max ) {
      foundBetterChoice = bestChoice.util < moveUtil;
    } else {
      foundBetterChoice = bestChoice.util > moveUtil;
    }

    if ( bestChoice.util == null || foundBetterChoice ) {
      bestChoice.util = moveUtil;
      bestChoice.move = move;
    }
  });

  return bestChoice;
}

function checkWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
    [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6],
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

export { PLAY_MODE, isTerminal, checkWinner, AIPlayer }
