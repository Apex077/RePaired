"use client";

import { Heart, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListingCardProps {
    listing: {
        id: string;
        title: string;
        product: string;
        condition: string;
        type: string;
        location: string;
        distance: string;
        price: number;
        images: string[];
    };
}

export function ListingCard({ listing }: ListingCardProps) {
    return (
        <div className="group bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:-translate-y-1">
            <div className="flex gap-4 p-4">
                {/* Image */}
                <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <div className="text-4xl">🎧</div>
                    <div className="absolute top-2 right-2">
                        <button className="p-1.5 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-md hover:scale-110 transition-transform">
                            <Heart className="h-4 w-4 text-slate-400 hover:text-red-500 transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                            {listing.title}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                            {listing.type === "CASE" ? "Case" : "Earbud"}
                        </span>
                    </div>

                    <div className="space-y-1.5 mb-3">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                            <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>{listing.distance} away</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                            <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            <span>Condition: {listing.condition}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {listing.price === 0 ? "Free" : `$${listing.price}`}
                        </div>
                        <Button size="sm" className="shadow-md">
                            Contact
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
