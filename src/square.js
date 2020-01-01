import React from 'react';

export default function Square(props) {
  let optStyles = '';
  optStyles += props.previewStyle ? props.previewStyle : '';
  optStyles += props.win ? props.win : '';

  return (
    <button
      className={`square ${optStyles}`}
      onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}
