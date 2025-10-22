import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../firebase';
import '../App.css';

import { isProfane } from '../utils/profanity';





// --- NEW HELPER FUNCTION ---
// Creates a consistent, fake email from a team name.
const createFakeEmailFromTeamName = (teamName) => {
  // 1. Convert to lowercase
  // 2. Replace spaces and special characters with nothing
  // 3. Append your fake domain
  const sanitized = teamName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${sanitized}@projectchimera.game`; // Use a custom domain
};

const Login = () => {
  // --- STATE HAS BEEN SIMPLIFIED ---

  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!teamName || !password) {
      setError("Team Name and Password are required.");
      return;
    }

    // --- CONVERT TEAM NAME TO FAKE EMAIL ---
    const fakeEmail = createFakeEmailFromTeamName(teamName);

    if (isRegistering) {
      if (isProfane(teamName)) {
        setError("This team name contains inappropriate language. Please choose another.");
        return; 
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, fakeEmail, password);
        const user = userCredential.user;

        await setDoc(doc(db, "live_game_sessions", user.uid), {
          email: fakeEmail, // Store the fake email for reference
          teamName: teamName.trim(), // Store the original, pretty team name
          status: 'unstarted',
          cluesFound: 0,
          evidence: []
        });
        
      } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
          setError('This team name is already taken. Please choose another.');
        } else {
          setError(err.message);
        }
      }
    } else { // Login logic
      try {
        await signInWithEmailAndPassword(auth, fakeEmail, password);
      } catch (err) {
        // Provide a generic error for security
        setError('Invalid team name or password.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-card">
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          {/* --- The input is now always for Team Name --- */}
          <input 
            type="text" 
            value={teamName} 
            onChange={(e) => setTeamName(e.target.value)} 
            placeholder="Team Name" 
            required 
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            required 
          />
          <button type="submit" className="button-primary">
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <button onClick={() => setIsRegistering(!isRegistering)} className="button-secondary">
          {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
      </div>
    </div>
  );
};

export default Login;