import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Trophy, Medal, Star, Headphones, Zap, ArrowLeft } from "lucide-react";

function getInitials(name: string | null): string {
    if (!name) return "?";
    return name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function computeScore(
    listings: { status: string }[]
): number {
    const listingBonus = listings.length * 10;
    const repairedBonus = listings.filter((l) => l.status === "REPAIRED").length * 25;
    return listingBonus + repairedBonus;
}

export default async function LeaderboardPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            image: true,
            points: true,
            listings: {
                select: { status: true },
            },
        },
    });

    const ranked = users
        .map((u) => ({
            id: u.id,
            name: u.name,
            image: u.image,
            score: u.points + computeScore(u.listings),
            listingCount: u.listings.length,
            repairedCount: u.listings.filter((l) => l.status === "REPAIRED").length,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 20);

    const currentUserId = session.user.id;
    const currentUserRank = ranked.findIndex((u) => u.id === currentUserId) + 1;

    const top3 = ranked.slice(0, 3);
    const rest = ranked.slice(3);

    const podiumOrder = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3;

    // Medal styling per rank
    const rankStyles: Record<number, { bg: string; ring: string; badge: string; label: string; height: string }> = {
        1: {
            bg: "from-amber-500/20 to-yellow-500/10",
            ring: "ring-amber-400/60",
            badge: "bg-amber-400 text-slate-900",
            label: "🥇",
            height: "h-36",
        },
        2: {
            bg: "from-slate-400/20 to-slate-500/10",
            ring: "ring-slate-400/60",
            badge: "bg-slate-300 text-slate-900",
            label: "🥈",
            height: "h-28",
        },
        3: {
            bg: "from-orange-600/20 to-orange-700/10",
            ring: "ring-orange-500/60",
            badge: "bg-orange-400 text-slate-900",
            label: "🥉",
            height: "h-24",
        },
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
                <div className="container mx-auto px-4 md:px-6 py-8">
                    <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Profile
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg shadow-amber-500/20">
                            <Trophy className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white">
                                Leaderboard
                            </h1>
                            <p className="text-slate-400 text-sm mt-0.5">
                                Top contributors in the RePaired community
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-10 max-w-3xl">

                {/* Scoring explanation */}
                <div className="mb-8 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                    <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-emerald-400" />
                        How points are earned
                    </h2>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-slate-400">
                            <span className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0">+10</span>
                            Per listing created
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                            <span className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold text-xs shrink-0">+25</span>
                            Per successful repair match
                        </div>
                    </div>
                </div>

                {/* Podium */}
                {top3.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-end justify-center gap-4">
                            {podiumOrder.map((user) => {
                                const rank = ranked.indexOf(user) + 1;
                                const style = rankStyles[rank];
                                const isCurrentUser = user.id === currentUserId;
                                return (
                                    <div
                                        key={user.id}
                                        className={`flex-1 max-w-[160px] flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-b ${style.bg} border ${isCurrentUser ? "border-emerald-500/40" : "border-slate-700/60"} transition-all`}
                                    >
                                        <div className="text-2xl">{style.label}</div>
                                        <div className={`relative h-14 w-14 rounded-full overflow-hidden ring-2 ${style.ring} shadow-lg`}>
                                            {user.image ? (
                                                <Image
                                                    src={user.image}
                                                    alt={user.name ?? "User"}
                                                    width={56}
                                                    height={56}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-700 text-white font-bold text-lg">
                                                    {getInitials(user.name)}
                                                </div>
                                            )}
                                        </div>
                                        <p className={`font-semibold text-sm text-center truncate w-full ${isCurrentUser ? "text-emerald-400" : "text-white"}`}>
                                            {user.name?.split(" ")[0] ?? "Anonymous"}
                                            {isCurrentUser && " (You)"}
                                        </p>
                                        <div className="flex flex-col items-center gap-0.5">
                                            <span className="text-xl font-bold text-white">{user.score}</span>
                                            <span className="text-xs text-slate-400">pts</span>
                                        </div>
                                        <div className={`w-full ${style.height} rounded-lg bg-slate-800/60 border border-slate-700/40`} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Full Rankings Table */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-slate-800 flex items-center gap-2">
                        <Medal className="h-4 w-4 text-slate-400" />
                        <h2 className="text-sm font-semibold text-slate-300">All Rankings</h2>
                    </div>
                    {ranked.length === 0 ? (
                        <div className="flex flex-col items-center py-16 text-slate-400 gap-3">
                            <Headphones className="h-10 w-10 text-slate-600" />
                            <p className="text-sm">No contributors yet. Be the first!</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-800">
                            {ranked.map((user, idx) => {
                                const rank = idx + 1;
                                const isCurrentUser = user.id === currentUserId;
                                return (
                                    <li
                                        key={user.id}
                                        className={`flex items-center gap-4 px-5 py-3.5 transition-colors ${isCurrentUser
                                            ? "bg-emerald-500/5 border-l-2 border-l-emerald-500"
                                            : "hover:bg-slate-800/40"
                                            }`}
                                    >
                                        {/* Rank */}
                                        <span className={`w-8 text-center font-bold text-sm shrink-0 ${rank <= 3 ? "text-amber-400" : "text-slate-500"}`}>
                                            {rank <= 3 ? ["🥇", "🥈", "🥉"][rank - 1] : `#${rank}`}
                                        </span>

                                        {/* Avatar */}
                                        <div className="h-9 w-9 rounded-full overflow-hidden ring-1 ring-slate-700 shrink-0">
                                            {user.image ? (
                                                <Image
                                                    src={user.image}
                                                    alt={user.name ?? "User"}
                                                    width={36}
                                                    height={36}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-700 text-white text-xs font-bold">
                                                    {getInitials(user.name)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Name + stats */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-medium text-sm truncate ${isCurrentUser ? "text-emerald-400" : "text-white"}`}>
                                                {user.name ?? "Anonymous"}
                                                {isCurrentUser && (
                                                    <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                                                        You
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                {user.listingCount} listing{user.listingCount !== 1 ? "s" : ""}
                                                {user.repairedCount > 0 && ` · ${user.repairedCount} matched`}
                                            </p>
                                        </div>

                                        {/* Score */}
                                        <div className="text-right shrink-0">
                                            <span className="font-bold text-white text-base">{user.score}</span>
                                            <span className="text-slate-500 text-xs ml-1">pts</span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Current user not in top 20 */}
                {currentUserRank === 0 && (
                    <div className="mt-4 flex items-center gap-3 px-5 py-3.5 bg-slate-900/60 border border-emerald-500/20 rounded-xl">
                        <Star className="h-4 w-4 text-emerald-400 shrink-0" />
                        <p className="text-sm text-slate-400">
                            You&apos;re not in the top 20 yet. List parts or complete repairs to earn points and climb the ranks!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
