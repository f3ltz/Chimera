import React, { useState, useEffect } from 'react';
// CLEANED UP IMPORTS: Removed addDoc, collection, etc. as they are no longer needed.
import { db } from '../firebase';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// Your other component imports
import Signalscope from './Signalscope';
import ClueDisplay from './ClueDisplay';
import LiveLeaderboard from './LiveLeaderboard'; // This is what you'll show at the end
import { fetchGameData, verifySolution } from '../api/mockApi';
import { getDistance } from '../utils/geolocation';
import '../App.css';

const ProjectChimeraGame = ({ user }) => {
  // ... all your useState hooks are perfect, no changes needed ...
  const [gameState, setGameState] = useState('BRIEFING');
  const [checkpoints, setCheckpoints] = useState([]);
  const [currentCheckpointIndex, setCurrentCheckpointIndex] = useState(0);
  const [collectedEvidence, setCollectedEvidence] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [distance, setDistance] = useState(Infinity);
  const [error, setError] = useState(null);
  const [startTime, setStartTime] = useState(null);

  // ... all your useEffect hooks are also perfect, no changes needed ...
  useEffect(() => {
    fetchGameData().then(data => {
      setCheckpoints(data.checkpoints);
    });
  }, []);

  useEffect(() => {
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setError(null);
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, []);
  
  useEffect(() => {
    if (userPosition && checkpoints.length > 0 && gameState === 'HUNTING') {
      const currentCheckpoint = checkpoints[currentCheckpointIndex];
      if (currentCheckpoint) {
        const newDistance = getDistance(
          userPosition.lat, userPosition.lng,
          currentCheckpoint.location.lat, currentCheckpoint.location.lng
        );
        setDistance(newDistance);
      }
    }
  }, [userPosition, currentCheckpointIndex, checkpoints, gameState]);


  // This function is perfect as-is.
  const updatePlayerProgress = async (newClueCount, gameStatus, finalTime = null) => {
    if (!user) return;
    
    const playerDocRef = doc(db, "live_game_sessions", user.uid);
    
    const progressData = {
      email: user.email,
      cluesFound: newClueCount,
      status: gameStatus,
      lastUpdate: serverTimestamp()
    };

    if (gameStatus === 'finished') {
      progressData.finishTime = finalTime; // Make sure this is "finishTime" to match your JSX
    }

    await setDoc(playerDocRef, progressData, { merge: true });
  };

  // This function is perfect as-is.
  const handleStartGame = () => {
    setStartTime(new Date());
    setGameState('HUNTING');
    updatePlayerProgress(0, 'in-progress');
  };

  const handleCodeSubmit = async (code) => {
    const currentCheckpoint = checkpoints[currentCheckpointIndex];
    try {
      const result = await verifySolution(currentCheckpoint.id, code);
      if (result.correct) {
        alert("Correct! Evidence unlocked.");
        const newEvidence = [...collectedEvidence, result.evidence];
        setCollectedEvidence(newEvidence);

        const newClueCount = newEvidence.length;

        if (currentCheckpointIndex < checkpoints.length - 1) {
          setCurrentCheckpointIndex(currentCheckpointIndex + 1);
          updatePlayerProgress(newClueCount, 'in-progress');
        } else {
          const endTime = new Date();
          const timeTaken = Math.round((endTime - startTime) / 1000);
          
          // The final update before finishing the game
          await updatePlayerProgress(newClueCount, 'finished', timeTaken);
          
          setGameState('FINISHED');
          // No alert needed, the UI will change to show the leaderboard
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // REMOVED: The redundant recordCompletion function is gone.

  // The render logic is perfect as-is.
  const renderGameState = () => {
    if (gameState === 'BRIEFING') {
      return (
        <div className="briefing">
          <h1>Project: Chimera</h1>
          <p>Dr. Aris Thorne has been murdered. The prototype is gone. Follow the leads, uncover the evidence, and find the killer.</p>
          <button onClick={handleStartGame}>Start Investigation</button>
        </div>
      );
    }

    if (gameState === 'HUNTING') {
      const currentCheckpoint = checkpoints[currentCheckpointIndex];
      if (!currentCheckpoint) {
        return <div>Loading next checkpoint...</div>;
      }
      return (
        <div className="hunting-view">
          {error && <div className="error">GPS Error: {error}</div>}
          <Signalscope distance={distance} />
          <ClueDisplay 
            checkpoint={currentCheckpoint} 
            distance={distance} 
            onSubmitCode={handleCodeSubmit}
          />
          <div className="evidence-log">
            <h3>Case File</h3>
            {collectedEvidence.length === 0 ? <p>No evidence collected yet.</p> : 
              <ul>{collectedEvidence.map((ev, i) => <li key={i}>{ev}</li>)}</ul>
            }
          </div>
        </div>
      );
    }

    if (gameState === 'FINISHED') {
      // This is perfect. It now shows the live leaderboard when the player finishes.
      return <LiveLeaderboard totalClues={checkpoints.length} />;
    }
    
    return <div>Loading Game...</div>;
  };

  return (
    <div className="App-container"> {/* Changed from "App" to avoid style conflicts */}
      {renderGameState()}
    </div>
  );
}

export default ProjectChimeraGame;