import React from 'react';
import Board from './board';

// The sidebar handles jumping and rendering the histories
//  in the proper order
// - The jump function passed via props works only with the original indicies orders
export default function HistorySidebar(props) {
  const history = props.reversed ?
    props.history.reverse() : props.history;

  return (
    <ul className='sidebar'>
      {
        history.map((prevState, moveNo) => {
          const jumpIdx = props.reversed ?
            history.length - moveNo - 1 : moveNo;

          return (
            <li key={moveNo}>
              <Board
                previewStyle='preview'
                squares={prevState.squares}
                onClick={() => props.onClick(jumpIdx)}/>
            </li>
          );
        })
      }
    </ul>
  );
}
