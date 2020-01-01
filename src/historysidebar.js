import React from 'react';
import Board from './board';

export default function HistorySidebar(props) {
  const history = props.history;
  const jumpFn = props.onClick;
  return (
    <ul className='sidebar'>
      {
        history.map((prevState, moveNo) => {
          return (
            <li>
              <Board key={moveNo}
                previewStyle='preview'
                squares={prevState.squares}
                onClick={() => jumpFn(moveNo)}/>
            </li>
          );
        })
      }
    </ul>
  );
}
