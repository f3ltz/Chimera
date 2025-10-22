import React, { useState, useEffect } from 'react';

const formatLiveTime = (totalSeconds) => {
  if (totalSeconds == null || isNaN(totalSeconds) || totalSeconds < 0) {
    return "00:00:00";
  }
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const LiveTimer = ({ startTime }) => {
  // --- FIX: Hooks are now called unconditionally at the top level ---
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    // If the game hasn't started, we don't need an interval.
    if (!startTime) {
      setElapsedSeconds(0); // Ensure timer is reset
      return;
    }

    // Set the initial value immediately
    setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    
    // Set up the interval to update it every second
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    // This cleanup function runs when the component unmounts or startTime changes
    return () => clearInterval(interval);

  }, [startTime]); // The effect correctly depends on startTime

  // --- FIX: Conditional rendering happens here, AFTER the hooks ---
  // If the game hasn't started, the component renders nothing.
  if (!startTime) {
    return null;
  }

  // Otherwise, it renders the timer UI.
  return (
    <div className="live-timer">
      <span className="timer-label">Time Elapsed</span>
      <span className="timer-digits">{formatLiveTime(elapsedSeconds)}</span>
    </div>
  );
};

export default LiveTimer;