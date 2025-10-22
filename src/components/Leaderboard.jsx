// src/components/LiveLeaderboard.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

// Helper function for the progress bar
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

// Helper function to format time
const formatDuration = (totalSeconds) => {
  if (totalSeconds == null || isNaN(totalSeconds) || totalSeconds < 0) {
    return "N/A";
  }
  if (totalSeconds === 0) return "0s";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);
  return parts.join(' ');
};

const LiveLeaderboard = ({ totalClues }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const playersCollection = collection(db, 'live_game_sessions');
    const q = query(
      playersCollection, 
      where('cluesFound', '>', 0),
      orderBy('cluesFound', 'desc'), 
      orderBy('lastUpdate', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const playersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlayers(playersData);
      setLoading(false);
    }, (error) => {
      console.error("Leaderboard query failed: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [totalClues]); // Add totalClues as a dependency

  if (loading) {
    return <div>Loading Live Standings...</div>;
  }

  return (
    <div className="leaderboard">
      <h2>Live Standings</h2>
      {players.length === 0 ? (
        <p className="leaderboard-empty-message">
          The race is on! Complete your first task to get on the board.
        </p>
      ) : (
        <ol>
          {players.map((player, index) => (
            <li key={player.id}>
              {/* Column 1: Rank and Name */}
              <div className="player-details">
                <span className="player-rank">{index + 1}.</span>
                <span className="player-name">{player.teamName || 'A Team'}</span>
              </div>

              {/* Column 2: Status (Time or Progress Bar) */}
              <div className="player-status">
                {player.status === 'finished' ? (
                  <span className="finish-time">
                    {formatDuration(player.finishTime)}
                  </span>
                ) : (
                  <>
                    {/* THIS IS THE RESTORED LOGIC */}
                    <ProgressBar value={player.cluesFound} max={totalClues} />
                    <span className="progress-text">
                      {player.cluesFound}/{totalClues}
                    </span>
                  </>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default LiveLeaderboard;