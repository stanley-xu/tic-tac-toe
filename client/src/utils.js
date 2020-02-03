const boards = {
  // oneLeft: [ 'O', 'O', 'X', 'X', null, 'O', null, null, 'X' ],
  xTrap: [ 'O', 'O', 'X', 'X', null, 'O', null, null, 'X' ],
};

function randRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

export { boards, randRange };
