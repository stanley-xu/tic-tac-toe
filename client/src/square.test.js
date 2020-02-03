import React from 'react'
import { act } from 'react-dom/test-utils'
import { unmountComponentAtNode, render } from 'react-dom'

import Square from './square'

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

it('renders custom styling', () => {
  act(() => {
    render(<Square id={42}/>, container);
  });
  const sq = document.querySelector('[data-testid=square-42]');
  expect(sq.className).toBe('square');

  act(() => {
    render(<Square previewStyle='preview-style'/>, container);
  });
  expect(sq.className).toBe('square preview-style');

  act(() => {
    render(<Square win='win-style'/>, container);
  });
  expect(sq.className).toBe('square win-style');
  
  act(() => {
    render(<Square previewStyle='preview-style' win='win-style'/>, container);
  });
  expect(sq.className).toBe('square preview-style win-style');
});
