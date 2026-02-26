"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in Next.js
const iconUrl =
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png";
const iconRetinaUrl =
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png";
const shadowUrl =
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Mock data for map pins
const MOCK_PINS = [
    { id: 1, pos: [51.505, -0.09], title: "AirPods Pro Left Bud" },
    { id: 2, pos: [51.51, -0.1], title: "Sony WF-1000XM4 Case" },
    { id: 3, pos: [51.51, -0.12], title: "Pixel Buds Pro Right Bud" },
];

export default function Map() {
    return (
        <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={false}
            className="h-full w-full rounded-xl z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {MOCK_PINS.map((pin) => (
                <Marker key={pin.id} position={pin.pos as [number, number]}>
                    <Popup>{pin.title}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
