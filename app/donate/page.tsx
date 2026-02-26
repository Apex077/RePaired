"use client";

import { Sparkles } from "lucide-react";
import ListingForm from "@/components/ListingForm";

export default function DonatePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Header */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 md:px-6 py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-emerald-500 rounded-lg">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                            Donate Your Spare
                        </h1>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                        Help someone complete their set and reduce e-waste
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="max-w-2xl mx-auto">
                    <ListingForm />
                </div>
            </div>
        </div>
    );
}
