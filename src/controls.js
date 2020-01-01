import React from 'react';

export function Toggle(props) {
  return (
    <button onClick={props.onClick}>
      {props.sortRecent ? 'Most recent' : 'Chronological'}
    </button>
  )
}

export function Restart(props) {
  return (
    <button onClick={props.onClick}>
      Restart
    </button>
  )
}
