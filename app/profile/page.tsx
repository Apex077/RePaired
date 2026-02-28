import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, Settings, Package, LogOut, Mail, ShieldCheck, MapPin, Trophy } from "lucide-react";

function getInitials(name: string | null): string {
    if (!name) return "?";
    return name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            points: true,
            listings: {
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    title: true,
                    product: true,
                    condition: true,
                    status: true,
                    type: true,
                    createdAt: true,
                },
            },
        },
    });

    if (!user) redirect("/login");

    const initials = getInitials(user.name);
    const availableCount = user.listings.filter((l) => l.status === "AVAILABLE").length;
    const repairedCount = user.listings.filter((l) => l.status === "REPAIRED").length;
    const computedScore = user.listings.length * 10 + repairedCount * 25 + user.points;

    // Compute leaderboard rank (all users)
    const allUsers = await prisma.user.findMany({
        select: {
            id: true,
            points: true,
            listings: { select: { status: true } },
        },
    });
    const userRank =
        allUsers
            .map((u) => ({
                id: u.id,
                score: u.points + u.listings.length * 10 + u.listings.filter((l) => l.status === "REPAIRED").length * 25,
            }))
            .sort((a, b) => b.score - a.score)
            .findIndex((u) => u.id === user.id) + 1;

    return (
        <div className="container py-10 px-4 md:px-6 mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row gap-6">

                {/* ── Sidebar ── */}
                <div className="w-full md:w-72 shrink-0 space-y-4">

                    {/* Avatar card */}
                    <div className="bg-card border rounded-xl p-6 flex flex-col items-center text-center gap-2">
                        <div className="h-24 w-24 rounded-full overflow-hidden ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-900/20 mb-2">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name ?? "User avatar"}
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-emerald-500/10 text-emerald-400 text-2xl font-bold">
                                    {initials}
                                </div>
                            )}
                        </div>

                        {/* Name — allow wrap */}
                        <h2 className="font-bold text-lg leading-tight text-center break-words w-full">
                            {user.name ?? "Anonymous"}
                        </h2>

                        {/* Email — truncate with tooltip fallback */}
                        <p
                            className="text-xs text-muted-foreground w-full truncate px-2"
                            title={user.email ?? ""}
                        >
                            {user.email}
                        </p>

                        <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-medium mt-1">
                            <ShieldCheck className="h-3 w-3" />
                            Verified
                        </span>
                    </div>

                    <div className="bg-card border rounded-xl p-4 grid grid-cols-4 divide-x divide-border text-center">
                        <div className="px-2">
                            <div className="text-xl font-bold text-emerald-400">{user.listings.length}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">Listings</div>
                        </div>
                        <div className="px-2">
                            <div className="text-xl font-bold text-blue-400">{availableCount}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">Active</div>
                        </div>
                        <div className="px-2">
                            <div className="text-xl font-bold text-purple-400">{repairedCount}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">Matched</div>
                        </div>
                        <div className="px-2">
                            <div className="text-xl font-bold text-amber-400">{computedScore}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">Pts</div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="bg-card border rounded-xl p-2 space-y-1">
                        <Button variant="secondary" className="w-full justify-start">
                            <User className="mr-2 h-4 w-4" /> Profile
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/donate">
                                <Package className="mr-2 h-4 w-4" /> My Listings
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/leaderboard" className="flex items-center">
                                <Trophy className="mr-2 h-4 w-4 text-amber-400" /> Leaderboard
                                {userRank > 0 && (
                                    <span className="ml-auto text-xs text-amber-400 font-bold">#{userRank}</span>
                                )}
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <Settings className="mr-2 h-4 w-4" /> Settings
                        </Button>
                        <div className="border-t border-border my-1" />
                        <form
                            action={async () => {
                                "use server";
                                await signOut({ redirectTo: "/login" });
                            }}
                        >
                            <Button
                                variant="ghost"
                                type="submit"
                                className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10"
                            >
                                <LogOut className="mr-2 h-4 w-4" /> Sign Out
                            </Button>
                        </form>
                    </nav>
                </div>

                {/* ── Main content ── */}
                <div className="flex-1 min-w-0 space-y-6">

                    {/* Account Information */}
                    <div className="bg-card border rounded-xl p-6">
                        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                            <User className="h-4 w-4 text-emerald-400" />
                            Account Information
                        </h3>
                        <div className="space-y-0 divide-y divide-border">
                            <div className="flex items-center justify-between py-3 gap-4">
                                <span className="text-sm text-muted-foreground shrink-0">Name</span>
                                <span className="text-sm font-medium text-right truncate">{user.name ?? "—"}</span>
                            </div>
                            <div className="flex items-start justify-between py-3 gap-4">
                                <span className="text-sm text-muted-foreground shrink-0">Email</span>
                                {/* Break long emails to avoid overflow */}
                                <span className="text-sm font-medium text-right break-all min-w-0">
                                    {user.email ?? "—"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3 gap-4">
                                <span className="text-sm text-muted-foreground shrink-0">Sign-in method</span>
                                <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Google
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3 gap-4">
                                <span className="text-sm text-muted-foreground shrink-0">Account ID</span>
                                <span className="text-xs font-mono text-muted-foreground text-right truncate max-w-[180px]" title={user.id}>
                                    {user.id}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* My Listings */}
                    <div className="bg-card border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-semibold flex items-center gap-2">
                                <Package className="h-4 w-4 text-emerald-400" />
                                My Listings
                            </h3>
                            {user.listings.length > 0 && (
                                <Link href="/donate">
                                    <Button size="sm" variant="outline" className="text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                                        + New Listing
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {user.listings.length === 0 ? (
                            <div className="flex flex-col items-center text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-lg gap-3">
                                <Package className="h-8 w-8 text-muted-foreground/40" />
                                <div>
                                    <p className="font-medium text-sm">No listings yet</p>
                                    <p className="text-xs mt-1">Have a spare earbud or case? List it here.</p>
                                </div>
                                <Link href="/donate">
                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white mt-1">
                                        Create your first listing
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {user.listings.map((listing) => (
                                    <li
                                        key={listing.id}
                                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-200 gap-4"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm truncate">{listing.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {listing.product} · {listing.type} · {listing.condition}
                                            </p>
                                        </div>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${listing.status === "AVAILABLE"
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                : listing.status === "REPAIRED"
                                                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                                    : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                                                }`}
                                        >
                                            {listing.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Quick Links */}
                    <div className="bg-card border rounded-xl p-6">
                        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-emerald-400" />
                            Explore
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Link href="/find" className="group flex items-center gap-3 p-4 rounded-lg border border-border hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all duration-200">
                                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors shrink-0">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Find Parts</p>
                                    <p className="text-xs text-muted-foreground">Browse listings near you</p>
                                </div>
                            </Link>
                            <Link href="/donate" className="group flex items-center gap-3 p-4 rounded-lg border border-border hover:border-blue-500/40 hover:bg-blue-500/5 transition-all duration-200">
                                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors shrink-0">
                                    <Package className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Donate / Sell</p>
                                    <p className="text-xs text-muted-foreground">List a spare part</p>
                                </div>
                            </Link>
                            <Link href="/login" className="group flex items-center gap-3 p-4 rounded-lg border border-border hover:border-slate-500/40 hover:bg-slate-500/5 transition-all duration-200">
                                <div className="h-10 w-10 rounded-lg bg-slate-500/10 flex items-center justify-center text-slate-400 group-hover:bg-slate-500/20 transition-colors shrink-0">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Messages</p>
                                    <p className="text-xs text-muted-foreground">Chat with other users</p>
                                </div>
                            </Link>
                            <Link href="/leaderboard" className="group flex items-center gap-3 p-4 rounded-lg border border-border hover:border-amber-500/40 hover:bg-amber-500/5 transition-all duration-200">
                                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-colors shrink-0">
                                    <Trophy className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Leaderboard</p>
                                    <p className="text-xs text-muted-foreground">
                                        {userRank > 0 ? `You are ranked #${userRank}` : "See who is leading"}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
