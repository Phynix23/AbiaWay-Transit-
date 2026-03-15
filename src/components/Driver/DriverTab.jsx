import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const DriverTab = () => {
  const [location, setLocation] = useState('Umuahia Main Park');
  const [speed, setSpeed] = useState(35);
  const [nextStop, setNextStop] = useState('Aba Road (2.5 km)');
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const routeIntervalRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([5.5244, 7.5244], 13);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Create custom icon for driver's vehicle
    const driverIcon = L.divIcon({
      className: 'custom-driver-icon',
      html: '<div style="background-color: #16a34a; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(22,163,74,0.5);"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10]
    });

    // Add driver's vehicle marker
    const driverMarker = L.marker([5.5244, 7.5244], { icon: driverIcon }).addTo(map);
    driverMarker.bindPopup("<b>Your Bus #AB-101</b><br>Current Position").openPopup();
    driverMarkerRef.current = driverMarker;

    // Add route line
    const routePoints = [
      [5.5244, 7.5244], // Umuahia
      [5.4244, 7.4744],
      [5.3244, 7.4244],
      [5.2244, 7.3744],
      [5.1167, 7.3667]  // Aba
    ];
    
    L.polyline(routePoints, { 
      color: '#16a34a', 
      weight: 4, 
      opacity: 0.7,
      dashArray: '10, 10'
    }).addTo(map);

    // Add some bus stops along the route
    const stopPoints = [
      { coords: [5.5244, 7.5244], name: 'Umuahia Main Park' },
      { coords: [5.4244, 7.4744], name: 'Ubakala Junction' },
      { coords: [5.3244, 7.4244], name: 'Osisioma' },
      { coords: [5.2244, 7.3744], name: 'Aba Road' },
      { coords: [5.1167, 7.3667], name: 'Aba City Terminal' }
    ];

    stopPoints.forEach(stop => {
      L.marker(stop.coords)
        .addTo(map)
        .bindPopup(`<b>${stop.name}</b>`);
    });

    // Force map to render correctly
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    // Handle window resize
    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    // Start GPS simulation
    let step = 0;
    routeIntervalRef.current = setInterval(() => {
      if (driverMarkerRef.current && mapInstanceRef.current) {
        // Move along the route
        step = (step + 1) % routePoints.length;
        const currentPoint = routePoints[step];
        
        driverMarkerRef.current.setLatLng(currentPoint);
        mapInstanceRef.current.panTo(currentPoint);
        
        // Update location text based on current position
        if (step === 0) setLocation('Umuahia Main Park');
        else if (step === 1) setLocation('Ubakala Junction');
        else if (step === 2) setLocation('Osisioma');
        else if (step === 3) setLocation('Approaching Aba Road');
        else if (step === 4) setLocation('Aba City Terminal');
        
        // Update speed randomly
        setSpeed(Math.floor(Math.random() * 20) + 30);
        
        // Update next stop
        const nextStopIndex = (step + 1) % routePoints.length;
        const stopNames = [
          'Ubakala Junction',
          'Osisioma', 
          'Aba Road',
          'Aba City Terminal',
          'Umuahia Main Park'
        ];
        setNextStop(`${stopNames[nextStopIndex]} (${(Math.random() * 2 + 1).toFixed(1)} km)`);
      }
    }, 4000);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (routeIntervalRef.current) {
        clearInterval(routeIntervalRef.current);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="driver-dashboard glass-card p-6">
        <h3 className="text-xl font-semibold mb-6">Driver Dashboard</h3>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center">
              <i data-lucide="user" className="w-8 h-8"></i>
            </div>
            <div>
              <h4 className="font-semibold">Chidi Okonkwo</h4>
              <p className="text-sm text-gray-400">Driver ID: DRV-101 • Bus #AB-101</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Today's Trips</p>
              <p className="text-2xl font-bold">8</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Next Trip</p>
              <p className="text-2xl font-bold">09:30</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Trip Management</h4>
            <div className="flex gap-3">
              <button className="btn-primary flex-1" onClick={() => alert('Trip started!')}>
                <i data-lucide="play" className="w-4 h-4 inline mr-2"></i>
                Start Trip
              </button>
              <button className="btn-secondary flex-1" onClick={() => alert('Trip paused')}>
                <i data-lucide="pause" className="w-4 h-4 inline mr-2"></i>
                Pause
              </button>
              <button className="sos-button flex-1" onClick={() => alert('Trip ended')}>
                <i data-lucide="square" className="w-4 h-4 inline mr-2"></i>
                End
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Bus Capacity Status</h4>
            <div className="flex gap-3">
              {['empty', 'medium', 'full'].map(status => (
                <button 
                  key={status}
                  className="booking-option flex-1 text-center p-3"
                  onClick={() => alert(`Bus status updated: ${status}`)}
                >
                  <span className="block text-sm capitalize">{status}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold mb-4">Live GPS Tracking Feed</h3>
        <div 
          ref={mapRef} 
          style={{ 
            height: '250px', 
            width: '100%', 
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '1rem'
          }} 
        />
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Current Location:</span>
            <span className="text-primary font-medium">{location}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Speed:</span>
            <span className="font-medium">{speed} km/h</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Next Stop:</span>
            <span className="text-primary">{nextStop}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>GPS Signal:</span>
            <span className="text-green-400 font-medium">Strong</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverTab;