import React from 'react'
import { render, fireEvent, waitForElement, getByText } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';

import Game from './game'

const boards = {
  xTrap: [ 'O', 'O', 'X', 'X', null, 'O', null, null, 'X' ]
};

test('smoke test', async () => {
  const { getByText } = render(<Game />);
  expect(getByText('Next player', { exact: false }))
    .toBeInTheDocument();
});

test('clicking takes turns in both modes', async () => {
  const { getByText, getByDisplayValue } = render(<Game/>);
  const dropdown = getByDisplayValue('ai player', { exact: false });  
  const sq = document.querySelector('.square');
  const status = getByText('Next', { exact: false });

  // test a click for human player X
  fireEvent.click(sq);
  expect(status).toHaveTextContent('X');
  expect(sq).toHaveTextContent('X');
  
  // clicking same square is ignored
  fireEvent.click(sq);
  expect(status).toHaveTextContent('X');
  expect(sq).toHaveTextContent('X');
  
  // change to human mode
  fireEvent.change(dropdown, { target: { value: 'human' }});
  expect(dropdown.selectedIndex).toBe(1);
  expect(dropdown.options[dropdown.selectedIndex])
    .toHaveTextContent('Human');
  
  // test a click for opposing players
  // player X
  fireEvent.click(sq);
  expect(sq).toHaveTextContent('X');
  expect(status).toHaveTextContent('O');
  
  // player Y
  // clicking an X filled square will be ignored
  fireEvent.click(sq);
  expect(sq).toHaveTextContent('X');
  expect(status).toHaveTextContent('O');

  // clicking a blank square fills it
  const blankSquares = Array.from(document.querySelectorAll('.square:not(.preview)'))
    .filter(sq => sq.textContent === '');
  fireEvent.click(blankSquares[0]);
  expect(blankSquares[0]).toHaveTextContent('O');
  expect(status).toHaveTextContent('X');
});

test('toggle changes text', async () => {
  const { getByText } = render(<Game/>);
  const toggle = getByText('Chronological');
  fireEvent.click(toggle);

  expect(toggle).toHaveTextContent('Most recent');
});

test('restart wipes board', async () => {
  const { getByText } = render(<Game/>);
  const button = getByText('Restart');
  fireEvent.click(button);
  
  const mainSquares = Array.from(document.querySelectorAll('.square:not(.preview)'));
  expect(mainSquares.filter(s => s.textContent !== '').length).toBe(0);
  expect(document.querySelectorAll('.preview').length).toBe(0);
});

test('game ends properly', async () => {
  const { getByText } = render(<Game initBoard={boards.xTrap}/>);
  const mainSquares = Array.from(document.querySelectorAll('.square:not(.preview)'));

  let blanks = mainSquares.filter(s => s.textContent === '');
  expect(blanks.length).toBe(3);

  fireEvent.click(blanks[0]);
  blanks = blanks.filter(s => s.textContent === '');
  expect(blanks.length).toBe(1);

  fireEvent.click(blanks[0]);
  expect(getByText(/win|draw/i)).toBeVisible();
})
