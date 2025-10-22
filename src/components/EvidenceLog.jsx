// src/components/EvidenceLog.jsx
import React from 'react';
import SuspectTile from './SuspectTile';

// --- UPDATED: The component now accepts timedUnlocks and currentTime as props ---
const EvidenceLog = ({ solvedClueIds, allCheckpoints, timedUnlocks, currentTime }) => {

  // Get the full checkpoint objects for the clues we've solved
  const solvedEvidenceFiles = solvedClueIds
    .map(id => allCheckpoints.find(cp => cp.id === id))
    .filter(Boolean); // Filter out any undefined items

  return (
    <div className="evidence-log-page">
      <h2>Case File: Evidence Log</h2>
      {/* Updated text to hint at the timed feature */}
      <p>Click on a file to review the suspect profile. Decrypting secondary data may take time.</p>
      
      {solvedEvidenceFiles.length === 0 ? (
        <div className="no-evidence-text">
          No evidence has been collected yet. Start hunting!
        </div>
      ) : (
        <div className="suspect-grid">
          {solvedEvidenceFiles.map(file => (
            // --- UPDATED: Pass the timer props down to each tile ---
            <SuspectTile 
              key={file.id}
              evidenceFile={file}
              unlockTime={timedUnlocks[file.id]} // Pass the specific start time for this clue
              currentTime={currentTime}           // Pass the current time for comparison
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EvidenceLog;