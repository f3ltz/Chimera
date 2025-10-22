import React from 'react';
// --- 1. IMPORT THE LIBRARY ---
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import '../App.css'; 

const MapView = ({ checkpoints, solvedClueIds }) => {
  return (
    <div className="map-view-page">
      <h2>Campus Map</h2>
     
      
      {/* --- 2. WRAP EVERYTHING IN THE LIBRARY'S COMPONENTS --- */}
      <TransformWrapper
        initialScale={1}
        minScale={1}       // Can't zoom out further than the initial view
        maxScale={8}       // Can zoom in up to 8x
        limitToBounds={true} // Prevents panning outside the map boundaries
        panning={{ velocityDisabled: true }} // Disables the "slippery" panning effect
        doubleClick={{ disabled: true }} // Disable double-click to zoom
      >
        <TransformComponent
          // These are class names for styling the wrapper divs
          wrapperClass="map-transform-wrapper"
          contentClass="map-transform-content"
        >
          {/* Your existing map container now lives inside */}
          <div className="map-container">
            <img src="/map.png" alt="Campus Map" className="map-image" />

            {/* The marker logic remains exactly the same! */}
            {checkpoints.map(checkpoint => (
              solvedClueIds.includes(checkpoint.id) && (
                <div 
                  key={checkpoint.id}
                  className="map-marker"
                  style={{ 
                    left: checkpoint.mapCoords.x, 
                    top: checkpoint.mapCoords.y 
                  }}
                >
                  <div className="map-marker-glow"></div>
                  <div className="map-marker-ring"></div>
                </div>
              )
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default MapView;