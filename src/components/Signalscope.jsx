// src/components/Signalscope.jsx
import React from 'react';

const Signalscope = ({ distance }) => {
  let signalStrength = "No Signal";
  let signalColor = "#333"; // Dark grey

  if (distance === Infinity) {
    signalStrength = "Acquiring GPS Signal...";
    signalColor = "#555";
  } else if (distance > 650) {
    signalStrength = `Signal Lost... Out of Range (${Math.round(distance)}m)`;
    signalColor = "#2c3e50"; // Midnight Blue
  } else if (distance > 300) {
    signalStrength = `Faint Signal Detected... (${Math.round(distance)}m)`;
    signalColor = "#3498db"; // Blue
  } else if (distance > 100) {
    signalStrength = `Signal Strengthening... (${Math.round(distance)}m)`;
    signalColor = "#2ecc71"; // Green
  } else if (distance > 50) {
    signalStrength = `STRONG SIGNAL. GETTING CLOSE! (${Math.round(distance)}m)`;
    signalColor = "#f1c40f"; // Yellow
  } else {
    signalStrength = "TARGET ACQUIRED! You're Here!";
    signalColor = "#e74c3c"; // Red
  }

  const style = {
    padding: '20px',
    margin: '20px 0',
    backgroundColor: signalColor,
    color: 'white',
    textAlign: 'center',
    borderRadius: '8px',
    transition: 'background-color 0.5s ease',
    fontSize: '1.2em',
    fontWeight: 'bold',
  };

  return <div style={style}>{signalStrength}</div>;
};

export default Signalscope;