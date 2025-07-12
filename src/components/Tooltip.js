import React from 'react';
import './ColorPicker.css';

export function Tooltip({ text, children }) {
  return (
    <div className="tooltip-wrapper">
      {children}
      <div className="tooltip-text">{text}</div>
    </div>
  );
}