"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function MapMap() {
    const Map = useMemo(
        () =>
            dynamic(() => import("@/components/Map"), {
                loading: () => <div className="h-full w-full bg-secondary/20 animate-pulse rounded-xl flex items-center justify-center text-muted-foreground">Loading Map...</div>,
                ssr: false,
            }),
        []
    );

    return <Map />;
}
