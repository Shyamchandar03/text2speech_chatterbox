import React from 'react';
import './TextInput.css';

function TextInput({ value, onChange }) {
  const MAX_CHARS = 500;
  const charCount = value.length;
  const percentUsed = (charCount / MAX_CHARS) * 100;

  return (
    <div className="text-input-wrapper">
      <textarea
        className="text-input"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
        placeholder="Enter the text you want to convert into speech..."
        rows="6"
      />
      <div className="char-counter">
        <span className={`count ${charCount > MAX_CHARS * 0.8 ? 'warning' : ''}`}>
          {charCount} / {MAX_CHARS}
        </span>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${percentUsed}%`,
              backgroundColor:
                percentUsed > 80 ? '#ffc107' : percentUsed > 90 ? '#dc3545' : '#667eea',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default TextInput;
