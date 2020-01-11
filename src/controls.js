import React from 'react';
import { PLAY_MODE } from './gameplay';

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
      <option value={PLAY_MODE.ai}>AI player</option>
      <option value={PLAY_MODE.human}>Human player</option>
    </select>
  )
}
