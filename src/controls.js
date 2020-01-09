import React from 'react';
import { GAME_MODE } from './game';

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
      <option value={GAME_MODE.ai}>AI player</option>
      <option value={GAME_MODE.human}>Human player</option>
    </select>
  )
}
