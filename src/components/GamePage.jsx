import React from 'react';
import Signalscope from './Signalscope';
import ClueDisplay from './ClueDisplay';
import LiveTimer from './LiveTimer';

const GamePage = ({
  gameState,
  handleStartGame,
  checkpoints,
  currentCheckpointIndex,
  error,
  distance,
  handleCodeSubmit,
  startTime,
  isHintRevealed
}) => {
  if (gameState === 'BRIEFING') {
    return (
      <div className="briefing">
        <h1>Project: Chimera</h1>
        <p>Dr. Aris Thorne has been murdered. The prototype is gone. Follow the leads, uncover the evidence, and find the killer.</p>
       
        
        <button onClick={handleStartGame} className="steampunk-button">Start Investigation</button>
      </div>
    );
  }

  if (gameState === 'HUNTING' || gameState === 'FINISHED') {
    const currentCheckpoint = checkpoints[currentCheckpointIndex];

    if (!currentCheckpoint) {
      return <div>Loading next checkpoint...</div>;
    }

    return (
      <div className="hunting-view">
        <LiveTimer startTime={startTime} /> 
        {error && <div className="error">GPS Error: {error}</div>}
        
        <Signalscope distance={distance} />
        {gameState === 'HUNTING' && isHintRevealed && (
          <div className="hint-container">
            <p className="hint-text"><strong>Hint:</strong> {currentCheckpoint.clue}</p>
          </div>
        )}
        <ClueDisplay 
          checkpoint={currentCheckpoint} 
          distance={distance} 
          onSubmitCode={handleCodeSubmit}
        />
      </div>
    );
  }

  return <div>Loading Game...</div>;
};

export default GamePage;