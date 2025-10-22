// src/components/MainGameScreen.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, setDoc, getDoc, getDocs, serverTimestamp, collection, runTransaction } from "firebase/firestore"; 
import { fetchGameData, verifySolution } from '../api/mockApi';
import { getDistance } from '../utils/geolocation';
import { generateCrypticText } from '../utils/cryptictext'; // Ensure filename is correct

// Import all the view components
import GameNav from './GameNav';
import GamePage from './GamePage';
import EvidenceLog from './EvidenceLog';
import LiveLeaderboard from './LiveLeaderboard';
import MapView from './MapView';
import Toast from './Toast';

const MainGameScreen = ({ user }) => {
  //================================================================================
  // STATE MANAGEMENT
  //================================================================================
  const [activeTab, setActiveTab] = useState('game');
  const [isGameLoading, setGameLoading] = useState(true);
  const [gameState, setGameState] = useState('BRIEFING');
  const [checkpoints, setCheckpoints] = useState([]);
  const [currentCheckpointIndex, setCurrentCheckpointIndex] = useState(0);
  const [collectedEvidence, setCollectedEvidence] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [distance, setDistance] = useState(Infinity);
  const [error, setError] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [timedUnlocks, setTimedUnlocks] = useState({});
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [toastMessage, setToastMessage] = useState('');
  const [notifiedClueIds, setNotifiedClueIds] = useState(new Set());

  //================================================================================
  // SIDE EFFECTS (useEffect Hooks)
  //================================================================================

  useEffect(() => {
    const initializeGame = async () => {
      setGameLoading(true);
      const gameData = await fetchGameData();
      setCheckpoints(gameData.checkpoints);

      if (user) {
        const playerDocRef = doc(db, "live_game_sessions", user.uid);
        const playerDoc = await getDoc(playerDocRef);

        if (playerDoc.exists()) {
          const data = playerDoc.data();
          if (data.status === 'in-progress' || data.status === 'finished') {
            console.log("Restoring progress and syncing timers...");

            // Restore the core game state from Firestore
            setGameState(data.status === 'finished' ? 'FINISHED' : 'HUNTING');
            const solvedClueIds = Array.isArray(data.evidence) ? data.evidence : [];
            setCollectedEvidence(solvedClueIds);
            
            const assignedClueId = data.currentAssignedClueId;
            const assignedIndex = gameData.checkpoints.findIndex(cp => cp.id === assignedClueId);
            setCurrentCheckpointIndex(assignedIndex > -1 ? assignedIndex : 0);
            if (data.startTime) setStartTime(data.startTime.toMillis());

            // --- THIS IS THE NEW, PERSISTENT TIMER LOGIC ---
            // 1. Load existing timers from localStorage
            let currentUnlocks = {};
            try {
              const savedUnlocks = localStorage.getItem('timedUnlocks');
              currentUnlocks = savedUnlocks ? JSON.parse(savedUnlocks) : {};
            } catch (e) {
              console.error("Could not parse timedUnlocks from localStorage", e);
            }
            
            let timersWereUpdated = false;

            // 2. Iterate over the TRUE solved clues from Firestore
            solvedClueIds.forEach(clueId => {
              // 3. If a solved clue is MISSING a local timer, create one NOW.
              if (!currentUnlocks[clueId]) {
                console.log(`Backfilling missing timer for solved clue: ${clueId}`);
                currentUnlocks[clueId] = Date.now();
                timersWereUpdated = true;
              }
            });

            // 4. If we added any new timers, save the updated object back to localStorage
            if (timersWereUpdated) {
              localStorage.setItem('timedUnlocks', JSON.stringify(currentUnlocks));
            }
            
            // 5. Finally, update the React state with the complete, synced list of timers
            setTimedUnlocks(currentUnlocks);
            // --- END OF NEW LOGIC ---
          }
        }
      }
      
      // Also load notified clues to prevent duplicate notifications
      const savedNotified = localStorage.getItem('notifiedClueIds');
      if (savedNotified) setNotifiedClueIds(new Set(JSON.parse(savedNotified)));
      
      setGameLoading(false);
    };
    initializeGame();
  }, [user]);
    
  useEffect(() => {
    const watcher = navigator.geolocation.watchPosition(
      (pos) => setUserPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => setError(err.message),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  useEffect(() => {
    if (userPosition && checkpoints.length > 0 && gameState === 'HUNTING') {
      const currentCheckpoint = checkpoints[currentCheckpointIndex];
      if (currentCheckpoint && currentCheckpoint.location) {
        setDistance(getDistance(
          userPosition.lat, userPosition.lng,
          currentCheckpoint.location.lat, currentCheckpoint.location.lng
        ));
      }
    }
  }, [userPosition, currentCheckpointIndex, checkpoints, gameState]);

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (checkpoints.length === 0) return;
    const TWO_MINUTES_IN_MS = 60* 1000;
    const newlyNotified = new Set(notifiedClueIds);
    let messageToShow = '';
    Object.keys(timedUnlocks).forEach(clueId => {
      const unlockStartTime = timedUnlocks[clueId];
      const isRevealed = currentTime >= unlockStartTime + TWO_MINUTES_IN_MS;
      if (isRevealed && !notifiedClueIds.has(clueId)) {
        const checkpoint = checkpoints.find(cp => cp.id === clueId);
        if (checkpoint) {
          messageToShow = `Secondary data from "${checkpoint.name}" decrypted!`;
          newlyNotified.add(clueId);
        }
      }
    });
    if (newlyNotified.size > notifiedClueIds.size) {
      setNotifiedClueIds(newlyNotified);
      setToastMessage(messageToShow);
      localStorage.setItem('notifiedClueIds', JSON.stringify([...newlyNotified]));
    }
  }, [currentTime, timedUnlocks, checkpoints, notifiedClueIds]);

  //================================================================================
  // HELPER & HANDLER FUNCTIONS
  //================================================================================

  const findAndAssignNextAvailableClue = async (currentUserPosition, currentSolvedClueIds, allCheckpoints) => {
    const unsolvedCheckpoints = allCheckpoints.filter(cp => !currentSolvedClueIds.includes(cp.id));
    if (unsolvedCheckpoints.length === 0) return null;
    const assignmentsSnapshot = await getDocs(collection(db, 'location_assignments'));
    const assignmentCounts = {};
    assignmentsSnapshot.forEach(doc => {
      assignmentCounts[doc.id] = doc.data()?.count || 0;
    });
    const scoredCheckpoints = unsolvedCheckpoints.map(cp => {
      const distance = getDistance(currentUserPosition.lat, currentUserPosition.lng, cp.location.lat, cp.location.lng);
      const count = assignmentCounts[cp.id] || 0;
      let score = count * 1000 + distance;
      return { ...cp, score };
    });
    scoredCheckpoints.sort((a, b) => a.score - b.score);
    const bestLocation = scoredCheckpoints[0];
    if (!bestLocation || !bestLocation.id) {
      console.error("Scoring logic failed to produce a best location.");
      return null;
    }
    console.log(`Assigning user to location: ${bestLocation.id} with score: ${bestLocation.score}`);
    const assignmentRef = doc(db, 'location_assignments', bestLocation.id);
    await runTransaction(db, async (transaction) => {
      const assignmentDoc = await transaction.get(assignmentRef);
      if (!assignmentDoc.exists()) {
        transaction.set(assignmentRef, { count: 1 });
      } else {
        const newCount = (assignmentDoc.data().count || 0) + 1;
        transaction.update(assignmentRef, { count: newCount });
      }
    });
    return bestLocation;
  };
  
  const updatePlayerProgress = async (currentAssignedClueId, solvedEvidenceIDs, gameStatus, finalTime = null) => {
    if (!user) return;
    const playerDocRef = doc(db, "live_game_sessions", user.uid);
    const progressData = {
      currentAssignedClueId: currentAssignedClueId,
      evidence: solvedEvidenceIDs,
      cluesFound: solvedEvidenceIDs.length,
      status: gameStatus,
      lastUpdate: serverTimestamp()
    };
    if (gameStatus === 'in-progress' && !startTime) {
      progressData.startTime = serverTimestamp();
    }
    if (gameStatus === 'finished') {
      progressData.finishTime = finalTime;
    }
    await setDoc(playerDocRef, progressData, { merge: true });
  };
  
  const handleStartGame = async () => {
    if (checkpoints.length === 0) return alert("Game data is still loading...");
    if (!userPosition) return alert("Acquiring your GPS signal...");
    setGameLoading(true);
    try {
      const assignedClue = await findAndAssignNextAvailableClue(userPosition, [], checkpoints);
      if (!assignedClue) throw new Error("No starting clue could be assigned.");
      const assignedIndex = checkpoints.findIndex(cp => cp.id === assignedClue.id);
      setStartTime(Date.now());
      setCurrentCheckpointIndex(assignedIndex);
      setGameState('HUNTING');
      await updatePlayerProgress(assignedClue.id, [], 'in-progress');
    } catch (err) {
      console.error("Error starting game:", err);
      alert(err.message);
    } finally {
      setGameLoading(false);
    }
  };

  const handleCodeSubmit = async (code) => {
    const currentCheckpoint = checkpoints[currentCheckpointIndex];
    try {
      const result = await verifySolution(currentCheckpoint.id, code);
      if (result.correct) {
        alert("Correct! Evidence log updated. A second fragment is decrypting...");
        const unlockTimestamp = Date.now();
        const newTimedUnlocks = { ...timedUnlocks, [currentCheckpoint.id]: unlockTimestamp };
        setTimedUnlocks(newTimedUnlocks);
        localStorage.setItem('timedUnlocks', JSON.stringify(newTimedUnlocks));
        const oldAssignmentRef = doc(db, 'location_assignments', currentCheckpoint.id);
        await runTransaction(db, async (transaction) => {
            const oldDoc = await transaction.get(oldAssignmentRef);
            if (oldDoc.exists()) {
                const newCount = Math.max(0, (oldDoc.data().count || 0) - 1);
                transaction.update(oldAssignmentRef, { count: newCount });
            }
        });
        const newCollectedEvidence = [...collectedEvidence, currentCheckpoint.id];
        setCollectedEvidence(newCollectedEvidence);
        if (newCollectedEvidence.length >= checkpoints.length) {
            const timeTaken = Math.round((Date.now() - startTime) / 1000);
            await updatePlayerProgress(null, newCollectedEvidence, 'finished', timeTaken);
            setGameState('FINISHED');
            setActiveTab('leaderboard');
        } else {
            const nextAssignedClue = await findAndAssignNextAvailableClue(userPosition, newCollectedEvidence, checkpoints);
            if (nextAssignedClue && nextAssignedClue.id) {
                const nextAssignedIndex = checkpoints.findIndex(cp => cp.id === nextAssignedClue.id);
                setCurrentCheckpointIndex(nextAssignedIndex);
                await updatePlayerProgress(nextAssignedClue.id, newCollectedEvidence, 'in-progress');
            } else {
                console.error("Failed to find a new clue to assign.", { solved: newCollectedEvidence, total: checkpoints.length });
                alert("Error: Could not find the next clue. Please contact an event organizer.");
            }
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  //================================================================================
  // RENDER LOGIC
  //================================================================================

  if (isGameLoading) {
    return <div>Loading your game...</div>;
  }

  const renderContent = () => {
    if (gameState === 'FINISHED' && activeTab === 'game') {
        return ( <div className='finished-game-view'> <h2>Investigation Complete</h2> <p>You have found all the evidence! Return to The Pavillion for the final showdown!</p> <button onClick={() => setActiveTab('leaderboard')}>View Leaderboard</button> </div> )
    }
    switch (activeTab) {
      case 'game':
        return <GamePage gameState={gameState} handleStartGame={handleStartGame} checkpoints={checkpoints} currentCheckpointIndex={currentCheckpointIndex} error={error} distance={distance} handleCodeSubmit={handleCodeSubmit} startTime={startTime} />;
      case 'map':
        return <MapView checkpoints={checkpoints} solvedClueIds={collectedEvidence} />;
      case 'evidence':
        return <EvidenceLog solvedClueIds={collectedEvidence} allCheckpoints={checkpoints} timedUnlocks={timedUnlocks} currentTime={currentTime} />;
      case 'leaderboard':
        return <LiveLeaderboard totalClues={checkpoints.length} />;
      default:
        return <GamePage />;
    }
  };

  return (
    <div className="main-game-screen">
      <div className="content-area">
        {renderContent()}
      </div>
      {toastMessage && ( <Toast message={toastMessage} onClose={() => setToastMessage('')} /> )}
      {gameState !== 'BRIEFING' && ( <GameNav activeTab={activeTab} setActiveTab={setActiveTab} /> )}
    </div>
  );
};

export default MainGameScreen;