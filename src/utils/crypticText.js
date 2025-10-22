// src/utils/crypticText.js

const SYMBOLS = ['█', '░', '▒', '▓', '?', '#', '*'];

// This function takes a string and returns a cryptic version of the same length.
export const generateCrypticText = (text) => {
  if (!text) return '';
  return text
    .split('')
    .map(char => {
      if (char === ' ') return ' '; // Keep spaces for structure
      return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    })
    .join('');
};