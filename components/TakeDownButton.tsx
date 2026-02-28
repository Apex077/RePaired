"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export default function TakeDownButton({ listingId }: { listingId: string }) {
    const [confirming, setConfirming] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleDelete() {
        setLoading(true);
        try {
            const res = await fetch(`/api/listings/${listingId}`, { method: "DELETE" });
            if (res.ok) {
                router.refresh(); // re-fetch server component data
            }
        } finally {
            setLoading(false);
            setConfirming(false);
        }
    }

    if (confirming) {
        return (
            <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs text-slate-400">Remove?</span>
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="text-xs px-2 py-1 rounded-md bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25 transition-colors font-medium disabled:opacity-50"
                >
                    {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Yes"}
                </button>
                <button
                    onClick={() => setConfirming(false)}
                    className="text-xs px-2 py-1 rounded-md text-slate-500 hover:text-slate-300 transition-colors"
                >
                    No
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setConfirming(true)}
            title="Take down listing"
            className="shrink-0 p-1.5 rounded-md text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
            <Trash2 className="h-3.5 w-3.5" />
        </button>
    );
}
