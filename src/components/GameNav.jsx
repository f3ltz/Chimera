import React from 'react';
import '../App.css'; // We'll add styles here later

const GameNav = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="game-nav">
      <button 
        className={activeTab === 'game' ? 'active' : ''}
        onClick={() => setActiveTab('game')}
      >
        Tracker
      </button>
      <button 
        className={activeTab === 'map' ? 'active' : ''}
        onClick={() => setActiveTab('map')}
      >
        Map
      </button>
      <button 
        className={activeTab === 'evidence' ? 'active' : ''}
        onClick={() => setActiveTab('evidence')}
      >
        CaseFile
      </button>
      <button 
        className={activeTab === 'leaderboard' ? 'active' : ''}
        onClick={() => setActiveTab('leaderboard')}
      >
        Leaderboard
      </button>
    </nav>
  );
};

export default GameNav;

// src/components/GameNav.jsx
