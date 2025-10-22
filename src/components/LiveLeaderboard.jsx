// src/components/LiveLeaderboard.jsx

import React from 'react';
import { formatTime } from '../utils/formatTime';

const ProgressBar = ({ value, max }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="progress-bar-container">
      <div 
        className="progress-bar-fill" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const LiveLeaderboard = ({ totalClues, players, loading, lastUpdated, currentUser }) => {
  const activePlayers = players.filter(player => player.cluesFound > 0);

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>Live Standings</h2>
        {lastUpdated && (
          <span className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>
      
      {loading && activePlayers.length === 0 ? (
        <div>Loading Live Standings...</div>
      ) : activePlayers.length === 0 ? (
        <div>No active players on the leaderboard yet.</div>
      ) : (
        <ol>
          {activePlayers.map((player, index) => {
            // Check if the current player in the map is the logged-in user
            const isCurrentUser = currentUser && player.id === currentUser.uid;
            
            // --- THIS IS THE FIX: The `return` statement is now included ---
            return (
              <li key={player.id}>
                {/* The special 'current-user' class is now correctly applied */}
                <span className={`player-name ${isCurrentUser ? 'current-user' : ''}`}>
                  {index + 1}. {player.teamName || 'A Team'}
                </span>
                <div className="player-status">
                  {player.status === 'finished' ? (
                    <span className="finish-time">{formatTime(player.finishTime)}</span>
                  ) : (
                    <>
                      <ProgressBar value={player.cluesFound} max={totalClues} />
                      <span className="progress-text">{player.cluesFound}/{totalClues}</span>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default LiveLeaderboard;