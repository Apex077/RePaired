"use client";

import dynamic from "next/dynamic";
import { useMemo, useEffect, useState } from "react";
import type { MapPin } from "@/components/Map";

const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629]; // India fallback

interface MapMapProps {
    pins?: MapPin[];
    zoom?: number;
}

export default function MapMap(props: MapMapProps) {
    const [center, setCenter] = useState<[number, number] | null>(null);
    const [locationReady, setLocationReady] = useState(false);

    // ── Fetch geolocation BEFORE rendering the map so MapContainer
    //    gets the real coordinates as its immutable initial center.
    useEffect(() => {
        if (!navigator.geolocation) {
            setCenter(DEFAULT_CENTER);
            setLocationReady(true);
            return;
        }

        // 8-second hard timeout in case the OS hangs on the request
        const timer = setTimeout(() => {
            setCenter(DEFAULT_CENTER);
            setLocationReady(true);
        }, 8000);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                clearTimeout(timer);
                setCenter([pos.coords.latitude, pos.coords.longitude]);
                setLocationReady(true);
            },
            () => {
                clearTimeout(timer);
                setCenter(DEFAULT_CENTER);
                setLocationReady(true);
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );

        return () => clearTimeout(timer);
    }, []);

    const Map = useMemo(
        () =>
            dynamic(() => import("@/components/Map"), {
                loading: () => (
                    <div
                        className="h-full w-full rounded-xl flex items-center justify-center"
                        style={{ background: "#1a2332" }}
                    >
                        <div className="flex flex-col items-center gap-3 text-slate-500">
                            <div className="w-8 h-8 rounded-full border-2 border-emerald-500/40 border-t-emerald-400 animate-spin" />
                            <span className="text-sm font-medium">Loading map…</span>
                        </div>
                    </div>
                ),
                ssr: false,
            }),
        []
    );

    // Show a "locating" skeleton until geolocation resolves
    if (!locationReady) {
        return (
            <div
                className="h-full w-full rounded-xl flex items-center justify-center"
                style={{ background: "#1a2332" }}
            >
                <div className="flex flex-col items-center gap-3 text-slate-400">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full border-2 border-blue-500/40 border-t-blue-400 animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center text-base">📍</div>
                    </div>
                    <span className="text-sm font-medium">Finding your location…</span>
                    <span className="text-xs text-slate-500">Allow location access when prompted</span>
                </div>
            </div>
        );
    }

    return <Map {...props} center={center!} userLocation={center!} />;
}
