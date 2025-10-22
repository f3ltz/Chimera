export const formatTime = (totalSeconds) => {
    // Handle cases where time might be missing or zero
    if (!totalSeconds || totalSeconds <= 0) {
      return "0s";
    }
  
    // Calculate hours, minutes, and remaining seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    // Build the time string, only including non-zero parts
    const parts = [];
    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    if (minutes > 0) {
      parts.push(`${minutes}m`);
    }
    // Always show seconds if it's the only unit or if it's part of a larger time
    if (seconds > 0 || parts.length === 0) {
      parts.push(`${seconds}s`);
    }
  
    return parts.join(' ');
  };