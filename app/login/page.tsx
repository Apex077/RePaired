"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleCredentialsSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        const form = e.currentTarget;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;

        startTransition(async () => {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password.");
            } else {
                window.location.href = "/";
            }
        });
    }

    async function handleGoogleSignIn() {
        await signIn("google", { callbackUrl: "/" });
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
            <div className="w-full max-w-[380px] space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        Welcome back
                    </h1>
                    <p className="text-sm text-slate-400">
                        Sign in to your RePaired account
                    </p>
                </div>

                {/* Credentials form */}
                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="email" className="text-slate-300 text-sm">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="password" className="text-slate-300 text-sm">
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                required
                                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all duration-200"
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Sign In
                    </Button>
                </form>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-slate-950 px-3 text-slate-500">
                            Or continue with
                        </span>
                    </div>
                </div>

                {/* Google */}
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    className="w-full border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white transition-all duration-200"
                >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Sign in with Google
                </Button>

                {/* Sign up link */}
                <p className="text-center text-sm text-slate-500">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                    >
                        Sign up
                    </Link>
                </p>

                {/* ToS */}
                <p className="px-4 text-center text-xs text-slate-600">
                    By signing in, you agree to our{" "}
                    <Link href="/terms" className="underline hover:text-slate-400 transition-colors">
                        Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline hover:text-slate-400 transition-colors">
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}
