import React from 'react';

export default function Splitpane(props) {
  return (
    <div className='pane-container'>
      <div className='pane-left'>
        {props.left}
      </div>
      <div className='pane-right'>
        {props.right}
      </div>
    </div>
  )
}
