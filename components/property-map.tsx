"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export function PropertyMap({
  latitude,
  longitude,
  title,
}: {
  latitude?: number;
  longitude?: number;
  title: string;
}) {
  if (!latitude || !longitude) {
    return null;
  }

  return (
    <div className="h-[360px] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100">
      <MapContainer center={[latitude, longitude]} zoom={13} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}>
          <Popup>{title}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
