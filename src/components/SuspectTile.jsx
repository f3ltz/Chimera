// src/components/SuspectTile.jsx
import React, { useState } from 'react';
// Make sure the filename matches what you created, e.g., 'crypticText.js'
import { generateCrypticText } from '../utils/cryptictext';

const SuspectTile = ({ evidenceFile, unlockTime, currentTime }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('evidence');

  // Defensive check to prevent crashes from bad data
  if (!evidenceFile || !evidenceFile.suspect) {
    console.error("SuspectTile was rendered with invalid data:", evidenceFile);
    return null;
  }
  
  const { suspect, clue1, clue2 } = evidenceFile;

  // --- REVEAL LOGIC ---
  const TWO_MINUTES_IN_MS = 3*60 * 1000;
  // Clue 2 is revealed if an unlockTime exists AND 2 minutes have passed since then
  const isClue2Revealed = unlockTime && currentTime >= unlockTime + TWO_MINUTES_IN_MS;

  // Generate a cryptic version of Clue 2 just once and store it in state
  const [crypticClue2] = useState(() => generateCrypticText(clue2));

  return (
    <div 
      className={`suspect-tile ${isExpanded ? 'expanded' : ''}`} 
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="suspect-header">
        <h3>{suspect.name}</h3>
        <span className="expand-icon">+</span>
      </div>

      <div className="expanded-content-wrapper">
        <div className="expanded-content">
          <nav className="internal-nav">
            <button 
              className={activeTab === 'evidence' ? 'active' : ''}
              onClick={(e) => { e.stopPropagation(); setActiveTab('evidence'); }}
            >
              Evidence
            </button>
            <button 
              className={activeTab === 'profile' ? 'active' : ''}
              onClick={(e) => { e.stopPropagation(); setActiveTab('profile'); }}
            >
              Profile
            </button>
          </nav>

          <div className="tab-content" data-active-tab={activeTab}>
            {/* Tab 1: Evidence */}
            <div className="clue-list">
              <div className="clue-list-item">
                <p><strong>Clue 1:</strong> {clue1}</p>
              </div>
              
              {/* --- THIS IS THE CORRECTED BLOCK FOR CLUE 2 --- */}
              {clue2 && (
                <div className={`clue-list-item ${isClue2Revealed ? 'revealed' : 'decrypting'}`}>
                  <p>
                    <strong>Clue 2:</strong> {isClue2Revealed ? clue2 : crypticClue2}
                  </p>
                  {!isClue2Revealed && (
                    <div className="decrypting-label">DECRYPTING...</div>
                  )}
                </div>
              )}
              {/* --- END OF CORRECTED BLOCK --- */}

            </div>
            
            {/* Tab 2: Profile */}
            <div className="suspect-profile">
              <p>{suspect.profile}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuspectTile;