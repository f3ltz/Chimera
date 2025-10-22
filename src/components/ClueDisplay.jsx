// src/components/ClueDisplay.jsx
import React, { useState } from 'react';

const ClueDisplay = ({ checkpoint, distance, onSubmitCode }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitCode(inputValue);
    setInputValue('');
  };
  
  const isClose = distance <= 15;

  return (
    <div className="clue-container">
      <h2>Checkpoint: {checkpoint.name}</h2>
      <p className="lead-text">{checkpoint.lead}</p>
      <hr />
      {isClose ? (
        <div className="task-area">
          <h3>TASK REVEALED:</h3>
          <p>{checkpoint.task}</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter solution code..."
            />
            <button type="submit">Unlock Evidence</button>
          </form>
        </div>
      ) : (
        <p className="task-locked">Get closer to the target location to reveal the task.</p>
      )}
    </div>
  );
};

export default ClueDisplay;