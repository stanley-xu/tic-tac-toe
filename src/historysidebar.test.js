import React from 'react'
import { unmountComponentAtNode, render } from 'react-dom';
import { act } from 'react-dom/test-utils'

import HistorySidebar from './historysidebar'

let container = null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

// mock dependency on Board component
jest.mock('./board', () => {
  return function DummyBoard(props) {
    return (
      <div data-testid='board' onClick={props.onClick}>
        {props.squares}
      </div>
    );
  };
});

const dummyHistory = [
  { squares: [ 'fakesquare1' ] }, { squares: [ 'fakesquare2' ] },
];

// helper to retrieve board state
function getBoardStates() {
  const items = Array.from(
    document.querySelector('[data-testid=history]').getElementsByTagName('li')
  );
  return items.map(i => i.querySelector('[data-testid=board]'));
}

// -------------

it('renders correctly sorted list', () => {
  act(() => {
    render(<HistorySidebar history={dummyHistory}/>, container);
  });
  let boards = getBoardStates();
  expect(boards[0].textContent).toBe('fakesquare1');
  expect(boards[1].textContent).toBe('fakesquare2');
  
  act(() => {
    render(<HistorySidebar history={dummyHistory} reversed={true}/>, container);
  });
  boards = getBoardStates();
  expect(boards[0].textContent).toBe('fakesquare2');
  expect(boards[1].textContent).toBe('fakesquare1');
});

// handler param is the index of the original history list
//  so if order were reversed, indicies start at `length - 1`
it('attaches a correct listener to the boards', () => {
  const handler = jest.fn();

  // test chronological ordering
  act(() => {
    render(<HistorySidebar history={dummyHistory} onClick={handler}/>, container);
  });
  let boards = getBoardStates();

  act(() => {
    boards[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    boards[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(handler).toHaveBeenCalledTimes(2);
  expect(handler.mock.calls[0][0]).toBe(0);
  expect(handler.mock.calls[1][0]).toBe(1);

  // test reverse chrono ordering
  act(() => {
    render(
      <HistorySidebar
        history={dummyHistory}
        reversed={true}
        onClick={handler}
      />, container
    );
  });
  boards = getBoardStates();

  act(() => {
    boards.forEach(b => {
      b.dispatchEvent(new MouseEvent('click', { bubbles : true }));
    });
  });
  expect(handler).toHaveBeenCalledTimes(4);
  expect(handler.mock.calls[2][0]).toBe(1);
  expect(handler.mock.calls[3][0]).toBe(0);
});
