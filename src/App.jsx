import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from './firebase';
import Login from './components/login';
import MainGameScreen from './components/MainGameScreen.jsx';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [playerProfile, setPlayerProfile] = useState(null); // --- NEW: State for profile data ---
  const [loading, setLoading] = useState(true);

  // --- UPDATED: onAuthStateChanged listener ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // User is logged in, fetch their profile from Firestore
        const playerDocRef = doc(db, "live_game_sessions", currentUser.uid);
        const playerDoc = await getDoc(playerDocRef);
        if (playerDoc.exists()) {
          setPlayerProfile(playerDoc.data());
        } else {
          // This could happen if a user was created but their doc failed to write
          console.warn("User is logged in, but no profile document was found.");
          setPlayerProfile(null);
        }
      } else {
        // User is logged out, clear the profile
        setPlayerProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return <div>Loading...</div>; // Or a more stylish loader
  }

  return (
    <div className="App">
      {user ? (
        <>
          <header className="app-header">
            <h1>Project: Chimera</h1>
            {/* --- NEW: Display Team Name --- */}
            <div className="user-info">
              <span>Team: {playerProfile?.teamName || '...'}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </header>
          <main>
            <MainGameScreen user={user} playerProfile={playerProfile}/>
          </main>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;