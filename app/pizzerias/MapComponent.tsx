"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  userLocation: {
    lat: number;
    lng: number;
  };
}

const MapComponent = ({ userLocation }: MapComponentProps) => {
  const customIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={13}
      maxZoom={18}
      zoomControl={true}
      style={{ height: "400px", width: "80%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[userLocation.lat, userLocation.lng]} icon={customIcon}>
        <Popup>Vous êtes ici</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;