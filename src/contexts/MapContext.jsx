import React, { createContext, useState, useContext } from 'react';

const MapContext = createContext();

export const useMap = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
  const [map, setMap] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [busMarkers, setBusMarkers] = useState([]);

  const centerMap = (coords) => {
    if (map) {
      map.setView(coords, 13);
    }
  };

  const addBusMarker = (marker) => {
    setBusMarkers(prev => [...prev, marker]);
  };

  const clearBusMarkers = () => {
    busMarkers.forEach(marker => {
      if (map) map.removeLayer(marker);
    });
    setBusMarkers([]);
  };

  return (
    <MapContext.Provider value={{ 
      map, setMap, 
      vehicle, setVehicle, 
      isTracking, setIsTracking, 
      busMarkers, addBusMarker, clearBusMarkers,
      centerMap 
    }}>
      {children}
    </MapContext.Provider>
  );
};