import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { useNotification } from '../../contexts/NotificationContext';
import { busStops, abiaCenter } from '../../data/constants';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const LiveMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routingControlRef = useRef(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [mapLayers, setMapLayers] = useState([
    { name: 'Street', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', active: true },
    { name: 'Satellite', url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', active: false },
    { name: 'Dark', url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', active: false },
  ]);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map with professional settings
    const map = L.map(mapRef.current, {
      center: abiaCenter,
      zoom: 11,
      zoomControl: false,
      fadeAnimation: true,
      markerZoomAnimation: true,
      preferCanvas: true, // Better performance for many markers
    });
    mapInstanceRef.current = map;

    // Add custom zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add scale control
    L.control.scale({ imperial: false, metric: true, position: 'bottomleft' }).addTo(map);

    // Add active tile layer
    const activeLayer = mapLayers.find(l => l.active);
    L.tileLayer(activeLayer.url, {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add professional bus stops with custom markers
    const stopNames = {
      umuahia: { name: 'Umuahia Main Park', type: 'terminal' },
      aba: { name: 'Aba City Terminal', type: 'terminal' },
      ohafia: { name: 'Ohafia Junction', type: 'junction' },
      bende: { name: 'Bende Road', type: 'stop' },
      arochukwu: { name: 'Arochukwu', type: 'stop' }
    };

    Object.entries(busStops).forEach(([key, coords]) => {
      const stop = stopNames[key];
      const icon = L.divIcon({
        className: `custom-stop-icon ${stop.type}`,
        html: `<i data-lucide="${stop.type === 'terminal' ? 'building-2' : 'map-pin'}" class="w-4 h-4 text-white"></i>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
      });

      const marker = L.marker(coords, { icon })
        .addTo(map)
        .bindPopup(`
          <div class="text-center">
            <b class="text-lg">${stop.name}</b><br>
            <span class="text-sm text-gray-600">${stop.type.charAt(0).toUpperCase() + stop.type.slice(1)}</span><br>
            <button class="btn-route px-3 py-1 mt-2 bg-green-600 text-white rounded-lg text-sm" 
                    onclick="window.setRoute('${key}')">
              Plan Route
            </button>
          </div>
        `);
      
      markersRef.current.push(marker);
    });

    // Add professional bus markers with live data
    const busLocations = [
      { id: 'AB-101', lat: 5.1066, lng: 7.3667, route: 'Osisioma', capacity: 65, speed: 35 },
      { id: 'AB-102', lat: 5.1156, lng: 7.3756, route: 'Park', capacity: 90, speed: 28 },
      { id: 'AB-103', lat: 5.1246, lng: 7.3845, route: 'Flyover', capacity: 30, speed: 42 },
      { id: 'AB-104', lat: 5.0976, lng: 7.3578, route: 'Zonal', capacity: 45, speed: 31 },
    ];

    const busIcon = L.divIcon({
      className: 'custom-bus-icon',
      html: '<i data-lucide="bus" class="w-5 h-5 text-white"></i>',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    busLocations.forEach((bus) => {
      const marker = L.marker([bus.lat, bus.lng], { icon: busIcon })
        .addTo(map)
        .bindPopup(`
          <div class="text-center">
            <b class="text-lg">Bus #${bus.id}</b><br>
            <span>Route: ${bus.route}</span><br>
            <span>Capacity: ${bus.capacity}%</span><br>
            <span>Speed: ${bus.speed} km/h</span><br>
            <button class="btn-track px-3 py-1 mt-2 bg-blue-600 text-white rounded-lg text-sm">
              Track
            </button>
          </div>
        `);
      
      markersRef.current.push(marker);
    });

    // Add professional route lines with gradients
    const routePoints = [
      busStops.umuahia,
      [5.4244, 7.4744],
      [5.3244, 7.4244],
      [5.2244, 7.3744],
      busStops.aba,
    ];

    L.polyline(routePoints, { 
      color: '#16a34a', 
      weight: 4, 
      opacity: 0.8,
      lineCap: 'round',
      lineJoin: 'round',
      dashArray: '5, 10',
      dashOffset: '0'
    }).addTo(map);

    // Add heat map layer for traffic (simulated)
    const heatPoints = busLocations.map(bus => [bus.lat, bus.lng, bus.capacity / 100]);
    // Note: You'd need leaflet-heat plugin for actual heat maps

    // Force map to render correctly
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    // Handle window resize
    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    // Load icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const centerMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.locate({ 
        setView: true, 
        maxZoom: 16,
        enableHighAccuracy: true 
      });
      showNotification('Location', '📍 Centering map on your position');
    }
  };

  const changeLayer = (layerName) => {
    const newLayers = mapLayers.map(l => ({
      ...l,
      active: l.name === layerName
    }));
    setMapLayers(newLayers);

    if (mapInstanceRef.current) {
      // Remove all tile layers
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      // Add new active layer
      const activeLayer = newLayers.find(l => l.active);
      L.tileLayer(activeLayer.url, {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }
  };

  const toggleFullscreen = () => {
    const mapContainer = mapRef.current;
    if (!document.fullscreenElement) {
      mapContainer.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const measureDistance = () => {
    showNotification('Measure', '📏 Click two points on the map to measure distance');
    // Implement measuring tool
  };

  return (
    <div className="lg:col-span-2">
      <div className="glass-card p-4">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <i data-lucide="map-pin" className="text-green-400"></i>
              Live Bus Tracking
            </h3>
            <div className="flex gap-1 bg-white/10 rounded-lg p-1">
              {mapLayers.map(layer => (
                <button
                  key={layer.name}
                  className={`px-3 py-1 rounded-lg text-xs transition ${
                    layer.active ? 'bg-primary text-white' : 'hover:bg-white/10'
                  }`}
                  onClick={() => changeLayer(layer.name)}
                >
                  {layer.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="live-indicator text-sm flex items-center gap-1 bg-green-500/20 px-3 py-1 rounded-full">
              <span className="live-dot"></span>
              <span>Live • 5s updates</span>
            </span>
            <button 
              className="btn-secondary px-3 py-1 rounded-lg text-sm tooltip" 
              data-tooltip="Center on my location"
              onClick={centerMap}
            >
              <i data-lucide="locate" className="w-4 h-4"></i>
            </button>
            <button 
              className="btn-secondary px-3 py-1 rounded-lg text-sm tooltip"
              data-tooltip="Measure distance"
              onClick={measureDistance}
            >
              <i data-lucide="ruler" className="w-4 h-4"></i>
            </button>
            <button 
              className="btn-secondary px-3 py-1 rounded-lg text-sm tooltip"
              data-tooltip="Toggle fullscreen"
              onClick={toggleFullscreen}
            >
              <i data-lucide="maximize" className="w-4 h-4"></i>
            </button>
          </div>
        </div>
        
        <div ref={mapRef} className="map-container" style={{ height: '450px' }}></div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30">
            <p className="text-2xl font-bold text-green-400">24</p>
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <i data-lucide="bus" className="w-3 h-3"></i>
              Active Buses
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30">
            <p className="text-2xl font-bold text-blue-400">8</p>
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <i data-lucide="route" className="w-3 h-3"></i>
              Active Routes
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30">
            <p className="text-2xl font-bold text-yellow-400">12 min</p>
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <i data-lucide="clock" className="w-3 h-3"></i>
              Avg. Wait Time
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30">
            <p className="text-2xl font-bold text-purple-400">1,847</p>
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <i data-lucide="users" className="w-3 h-3"></i>
              Passengers Today
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <button className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm hover:bg-green-500/30 transition flex items-center gap-2">
            <i data-lucide="bus" className="w-4 h-4"></i>
            Aba-Umuahia
            <span className="bg-green-500/30 px-2 py-0.5 rounded-full text-xs">8 buses</span>
          </button>
          <button className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm hover:bg-green-500/30 transition flex items-center gap-2">
            <i data-lucide="bus" className="w-4 h-4"></i>
            Umuahia-Ohafia
            <span className="bg-green-500/30 px-2 py-0.5 rounded-full text-xs">5 buses</span>
          </button>
          <button className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm hover:bg-green-500/30 transition flex items-center gap-2">
            <i data-lucide="bus" className="w-4 h-4"></i>
            Aba City
            <span className="bg-green-500/30 px-2 py-0.5 rounded-full text-xs">12 buses</span>
          </button>
          <button className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm hover:bg-green-500/30 transition flex items-center gap-2">
            <i data-lucide="bus" className="w-4 h-4"></i>
            Umuahia City
            <span className="bg-green-500/30 px-2 py-0.5 rounded-full text-xs">7 buses</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;