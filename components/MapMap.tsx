"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { MapPin } from "@/components/Map";

interface MapMapProps {
    pins?: MapPin[];
    center?: [number, number];
    zoom?: number;
}

export default function MapMap(props: MapMapProps) {
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

    return <Map {...props} />;
}
