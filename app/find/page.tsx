"use client";

import { MapPin, Package } from "lucide-react";
import MapMap from "@/components/MapMap";
import { ListingCard } from "@/components/ListingCard";

// Mock data
const mockListings = [
    {
        id: "1",
        title: "AirPods Pro 2 - Left Earbud",
        product: "AirPods Pro 2",
        condition: "Good",
        type: "BUD",
        location: "San Francisco, CA",
        distance: "2.3 miles",
        price: 0,
        images: ["/mock-image.jpg"],
    },
    {
        id: "2",
        title: "Galaxy Buds 2 - Charging Case",
        product: "Galaxy Buds 2",
        condition: "Like New",
        type: "CASE",
        location: "Oakland, CA",
        distance: "5.1 miles",
        price: 0,
        images: ["/mock-image.jpg"],
    },
];

export default function FindPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Header */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 md:px-6 py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg">
                            <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                            Find Your Match
                        </h1>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                        Browse available earbuds and charging cases near you
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 md:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-16rem)]">
                    {/* Listings Sidebar */}
                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <Package className="h-4 w-4" />
                                <span>{mockListings.length} items available</span>
                            </div>
                        </div>

                        {mockListings.map((listing) => (
                            <div key={listing.id} className="animate-fade-in">
                                <ListingCard listing={listing} />
                            </div>
                        ))}
                    </div>

                    {/* Map */}
                    <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 sticky top-4 h-full">
                        <MapMap />
                    </div>
                </div>
            </div>
        </div>
    );
}
