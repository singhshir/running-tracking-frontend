// components/MapView.jsx
//
// WHAT: Wraps react-leaflet to show an OpenStreetMap tile map with the
//       user's current position marker and their route drawn as a polyline.
// WHY: Used on both the "Start Running" page (live route) and "Run Details"
//      page (completed route), so the map logic is written once here.
//
// NOTE: We intentionally use OpenStreetMap tiles only (no Google Maps),
// per the project requirements.

import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

// Leaflet's default marker icons reference image files that don't bundle
// correctly with Vite out of the box, so we rebuild the default icon from
// the package's own asset URLs. This keeps the pin looking normal instead
// of showing a broken image.
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const DEFAULT_CENTER = [27.7172, 85.324]; // Kathmandu — sensible fallback center

// Keeps the map centered on the latest position as it changes, without
// forcing a full re-render of the map container each time.
const RecenterOnMove = ({ position, follow }) => {
  const map = useMap();

  useEffect(() => {
    if (position && follow) {
      map.setView([position.latitude, position.longitude], map.getZoom() || 16, {
        animate: true,
      });
    }
  }, [position, follow, map]);

  return null;
};

const MapView = ({ currentPosition, route = [], follow = true, className = '' }) => {
  const center = currentPosition
    ? [currentPosition.latitude, currentPosition.longitude]
    : route.length > 0
    ? [route[0].latitude, route[0].longitude]
    : DEFAULT_CENTER;

  const polylinePositions = route.map((point) => [point.latitude, point.longitude]);

  return (
    <div className={`overflow-hidden rounded-xl border border-border ${className}`}>
      <MapContainer center={center} zoom={16} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {polylinePositions.length > 1 && (
          <Polyline positions={polylinePositions} pathOptions={{ color: '#F97316', weight: 4 }} />
        )}

        {currentPosition && (
          <Marker position={[currentPosition.latitude, currentPosition.longitude]} icon={defaultIcon} />
        )}

        <RecenterOnMove position={currentPosition} follow={follow} />
      </MapContainer>
    </div>
  );
};

export default MapView;
