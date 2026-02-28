"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Sparkles, LogOut, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type User = {
    name: string | null;
    email: string | null;
    image: string | null;
};

type NavbarClientProps = {
    user: User | null;
    signOutAction: () => Promise<void>;
};

function getInitials(name: string | null): string {
    if (!name) return "?";
    return name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export default function NavbarClient({ user, signOutAction }: NavbarClientProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <Sparkles className="h-6 w-6 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="text-xl font-bold text-white">
                            RePaired
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        <Link
                            href="/find"
                            className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors duration-200"
                        >
                            Find Parts
                        </Link>
                        <Link
                            href="/donate"
                            className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors duration-200"
                        >
                            Donate
                        </Link>
                        <Link
                            href="/profile"
                            className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors duration-200"
                        >
                            Profile
                        </Link>
                        {user && (
                            <Link
                                href="/leaderboard"
                                className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors duration-200"
                            >
                                <Trophy className="h-4 w-4" />
                                Leaderboard
                            </Link>
                        )}
                    </div>

                    {/* Auth Area */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <>
                                {/* Avatar */}
                                <Link href="/profile" className="flex items-center gap-2 group">
                                    <div className="h-8 w-8 rounded-full overflow-hidden ring-2 ring-emerald-500/30 group-hover:ring-emerald-500/60 transition-all">
                                        {user.image ? (
                                            <Image
                                                src={user.image}
                                                alt={user.name ?? "User"}
                                                width={32}
                                                height={32}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                                                {getInitials(user.name)}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-slate-300 group-hover:text-emerald-400 transition-colors max-w-[120px] truncate">
                                        {user.name?.split(" ")[0] ?? "Profile"}
                                    </span>
                                </Link>

                                {/* Sign Out */}
                                <form action={signOutAction}>
                                    <button
                                        type="submit"
                                        title="Sign out"
                                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                                    >
                                        <LogOut className="h-4 w-4" />
                                    </button>
                                </form>
                            </>
                        ) : (
                            <Link href="/login">
                                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-emerald-500/20 transition-all duration-300">
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? (
                            <X className="h-6 w-6 text-slate-300" />
                        ) : (
                            <Menu className="h-6 w-6 text-slate-300" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                <div
                    className={cn(
                        "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
                        isOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
                    )}
                >
                    <div className="flex flex-col space-y-3 pt-4 border-t border-slate-800">
                        <Link
                            href="/find"
                            className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg transition-all duration-200"
                            onClick={() => setIsOpen(false)}
                        >
                            Find Parts
                        </Link>
                        <Link
                            href="/donate"
                            className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg transition-all duration-200"
                            onClick={() => setIsOpen(false)}
                        >
                            Donate
                        </Link>
                        <Link
                            href="/profile"
                            className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg transition-all duration-200"
                            onClick={() => setIsOpen(false)}
                        >
                            Profile
                        </Link>
                        {user && (
                            <Link
                                href="/leaderboard"
                                className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-amber-500/10 hover:text-amber-400 rounded-lg transition-all duration-200 flex items-center gap-2"
                                onClick={() => setIsOpen(false)}
                            >
                                <Trophy className="h-4 w-4" />
                                Leaderboard
                            </Link>
                        )}

                        {user ? (
                            <div className="px-4 pt-2 border-t border-slate-800 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full overflow-hidden ring-2 ring-emerald-500/30">
                                        {user.image ? (
                                            <Image
                                                src={user.image}
                                                alt={user.name ?? "User"}
                                                width={32}
                                                height={32}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                                                {getInitials(user.name)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">{user.name}</p>
                                        <p className="text-xs text-slate-400">{user.email}</p>
                                    </div>
                                </div>
                                <form action={signOutAction}>
                                    <button
                                        type="submit"
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <Link href="/login" onClick={() => setIsOpen(false)}>
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg">
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
