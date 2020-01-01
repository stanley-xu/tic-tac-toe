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

export function PlayMode(props) {
  return (
    <select value={props.value} onChange={props.onChange}>
      <option value='ai'>AI player</option>
      <option value='human'>Human player</option>
    </select>
  )
}
