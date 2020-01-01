import React from 'react';
import Board from './board';

export default function HistorySidebar(props) {
  const history = props.reversed ?
    props.history.reverse() : props.history;
  const jumpFn = props.onClick;
  return (
    <ul className='sidebar'>
      {
        history.map((prevState, moveNo) => {
          return (
            <li key={moveNo}>
              <Board
                previewStyle='preview'
                squares={prevState.squares}
                onClick={() => jumpFn(history.length - moveNo - 1)}/>
            </li>
          );
        })
      }
    </ul>
  );
}
