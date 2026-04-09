import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom Icon Creator
const createCustomIcon = (type) => {
  const colors = {
    court: '#1e293b',   // navy-800
    police: '#dc2626',  // red-600
    legalaid: '#059669', // emerald-600
    default: '#4f46e5'  // indigo-600
  };
  const color = colors[type] || colors.default;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });
};

function RecenterAuto({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom);
      // Force a resize check to ensure markers are rendered
      setTimeout(() => map.invalidateSize(), 100);
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapView({ center, places, zoom = 13 }) {
  if (!center || !center[0] || !center[1]) return null;

  return (
    <div className="w-full h-full relative isolate">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full"
        style={{ height: "100%", width: "100%", zIndex: 1 }}
      >
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterAuto center={center} zoom={zoom} />

        {places && places.map((place) => (
          place.lat && place.lng && (
            <Marker 
              key={place.id} 
              position={[place.lat, place.lng]}
              icon={createCustomIcon(place.type)}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[120px]">
                  <strong className="text-navy-900 block text-xs mb-0.5 leading-tight">{place.name}</strong>
                  <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">{place.address}</p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-navy-600 px-1.5 py-0.5 bg-navy-50 rounded uppercase">
                      {place.type}
                    </span>
                    <span className="text-[9px] font-bold text-amber-600">★ {place.rating}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
}
