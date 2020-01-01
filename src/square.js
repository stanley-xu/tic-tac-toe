import React from 'react';

export default function Square(props) {
  return (
    <button
      className={props.previewStyle || 'square'}
      onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}
