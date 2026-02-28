"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ─── Custom branded marker (emerald glow pin) ─────────────────────────────────
const createCustomIcon = (type: "BUD" | "CASE" = "BUD") => {
    const color = type === "CASE" ? "#3b82f6" : "#10b981";
    const svgMarker = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <!-- Drop shadow -->
      <ellipse cx="16" cy="39" rx="7" ry="3" fill="rgba(0,0,0,0.35)"/>
      <!-- Pin body -->
      <path d="M16 2C9.37 2 4 7.37 4 14c0 9 12 26 12 26s12-17 12-26C28 7.37 22.63 2 16 2z"
        fill="${color}" filter="url(#glow)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
      <!-- Inner circle -->
      <circle cx="16" cy="14" r="6" fill="rgba(255,255,255,0.9)"/>
      <!-- Icon: headphones or case -->
      <text x="16" y="18" font-size="7" text-anchor="middle" font-family="system-ui" fill="${color}">
        ${type === "CASE" ? "📦" : "🎧"}
      </text>
    </svg>`;

    return L.divIcon({
        html: svgMarker,
        className: "",
        iconSize: [32, 42],
        iconAnchor: [16, 42],
        popupAnchor: [0, -44],
    });
};

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface MapPin {
    id: number | string;
    pos: [number, number];
    title: string;
    type?: "BUD" | "CASE";
    price?: number;
    condition?: string;
    distance?: string;
}

// ─── Default mock pins ─────────────────────────────────────────────────────────
const DEFAULT_PINS: MapPin[] = [
    { id: 1, pos: [12.7558, 80.2021], title: "AirPods Pro Left Bud", type: "BUD", price: 0, condition: "Good", distance: "0.6 km" },
    { id: 2, pos: [12.7490, 80.1953], title: "Sony WF-1000XM4 Case", type: "CASE", price: 12, condition: "Like New", distance: "1.1 km" },
    { id: 3, pos: [12.7601, 80.1942], title: "Pixel Buds Pro Right Bud", type: "BUD", price: 0, condition: "Fair", distance: "1.8 km" },
    { id: 4, pos: [12.7511, 80.2038], title: "Galaxy Buds 2 Case", type: "CASE", price: 0, condition: "Good", distance: "0.9 km" },
    { id: 5, pos: [12.7469, 80.2004], title: "AirPods 3 Left Bud", type: "BUD", price: 8, condition: "Good", distance: "1.4 km" },
];

interface MapProps {
    pins?: MapPin[];
    center?: [number, number];
    zoom?: number;
    userLocation?: [number, number] | null;
}

export default function Map({ pins = DEFAULT_PINS, center = [12.7524, 80.1987], zoom = 14, userLocation }: MapProps) {
    return (

        <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={false}
            className="h-full w-full z-0"
            style={{ background: "#1a2332" }}
        >
            {/* Dark CartoDB tile layer — no API key required */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                subdomains="abcd"
                maxZoom={20}
            />

            {/* Geolocation — "You are here" circles (position provided by parent) */}
            {userLocation && (
                <>
                    {/* Outer pulsing ring */}
                    <Circle
                        center={userLocation}
                        radius={80}
                        pathOptions={{
                            color: "#3b82f6",
                            fillColor: "#3b82f6",
                            fillOpacity: 0.12,
                            weight: 1.5,
                            opacity: 0.5,
                        }}
                    />
                    {/* Inner solid dot */}
                    <Circle
                        center={userLocation}
                        radius={18}
                        pathOptions={{
                            color: "#ffffff",
                            fillColor: "#3b82f6",
                            fillOpacity: 1,
                            weight: 3,
                        }}
                    >
                        <Popup className="repaired-popup" closeButton={false} minWidth={140}>
                            <div className="popup-card">
                                <p className="popup-title" style={{ margin: 0 }}>📍 You are here</p>
                            </div>
                        </Popup>
                    </Circle>
                </>
            )}

            {pins.map((pin) => (
                <Marker
                    key={pin.id}
                    position={pin.pos}
                    icon={createCustomIcon(pin.type)}
                >
                    <Popup
                        className="repaired-popup"
                        closeButton={false}
                        minWidth={200}
                    >
                        {/* Styled popup card */}
                        <div className="popup-card">
                            <div className="popup-header">
                                <span className="popup-badge"
                                    style={{
                                        background: pin.type === "CASE"
                                            ? "rgba(59,130,246,0.15)"
                                            : "rgba(16,185,129,0.15)",
                                        color: pin.type === "CASE" ? "#60a5fa" : "#34d399",
                                        border: `1px solid ${pin.type === "CASE" ? "rgba(59,130,246,0.3)" : "rgba(16,185,129,0.3)"}`,
                                    }}
                                >
                                    {pin.type === "CASE" ? "📦 Case" : "🎧 Earbud"}
                                </span>
                                <span className="popup-price">
                                    {pin.price === 0 || pin.price === undefined ? "Free" : `$${pin.price}`}
                                </span>
                            </div>
                            <p className="popup-title">{pin.title}</p>
                            {(pin.condition || pin.distance) && (
                                <div className="popup-meta">
                                    {pin.condition && <span>✦ {pin.condition}</span>}
                                    {pin.distance && <span>📍 {pin.distance}</span>}
                                </div>
                            )}
                            <button className="popup-cta">View Listing</button>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* Popup styles injected into the page */}
            <style>{`
                .repaired-popup .leaflet-popup-content-wrapper {
                    background: #1e293b;
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 12px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(16,185,129,0.1);
                    padding: 0;
                    overflow: hidden;
                }
                .repaired-popup .leaflet-popup-tip-container {
                    display: none;
                }
                .repaired-popup .leaflet-popup-content {
                    margin: 0;
                    line-height: 1;
                }
                .popup-card {
                    padding: 14px 16px;
                    font-family: system-ui, -apple-system, sans-serif;
                }
                .popup-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }
                .popup-badge {
                    font-size: 11px;
                    font-weight: 600;
                    padding: 3px 8px;
                    border-radius: 999px;
                }
                .popup-price {
                    font-size: 14px;
                    font-weight: 700;
                    color: #10b981;
                }
                .popup-title {
                    font-size: 13px;
                    font-weight: 600;
                    color: #f1f5f9;
                    margin: 0 0 8px;
                    line-height: 1.4;
                }
                .popup-meta {
                    display: flex;
                    gap: 10px;
                    font-size: 11px;
                    color: #94a3b8;
                    margin-bottom: 12px;
                }
                .popup-cta {
                    width: 100%;
                    padding: 7px 12px;
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    font-size: 12px;
                    font-weight: 600;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: opacity 0.2s;
                }
                .popup-cta:hover { opacity: 0.85; }
            `}</style>
        </MapContainer>
    );
}
