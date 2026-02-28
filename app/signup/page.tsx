"use client";

import { useState, useTransition, useCallback } from "react";
import Link from "next/link";
import { registerUser } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Password strength logic ──────────────────────────────────────────────────
type StrengthLevel = "empty" | "weak" | "fair" | "strong" | "very-strong";

interface StrengthCheck {
    label: string;
    test: (pw: string) => boolean;
}

const CHECKS: StrengthCheck[] = [
    { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
    { label: "Uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
    { label: "Lowercase letter", test: (pw) => /[a-z]/.test(pw) },
    { label: "Number", test: (pw) => /[0-9]/.test(pw) },
    { label: "Special character", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

function getStrength(password: string): { level: StrengthLevel; score: number } {
    if (!password) return { level: "empty", score: 0 };
    const score = CHECKS.filter((c) => c.test(password)).length;
    let level: StrengthLevel = "weak";
    if (score >= 5) level = "very-strong";
    else if (score >= 4) level = "strong";
    else if (score >= 2) level = "fair";
    return { level, score };
}

const strengthConfig: Record<StrengthLevel, { label: string; bars: number; color: string }> = {
    empty: { label: "", bars: 0, color: "" },
    weak: { label: "Weak", bars: 1, color: "bg-red-500" },
    fair: { label: "Fair", bars: 2, color: "bg-amber-400" },
    strong: { label: "Strong", bars: 3, color: "bg-emerald-400" },
    "very-strong": { label: "Very Strong", bars: 4, color: "bg-emerald-500" },
};

// ── Component ────────────────────────────────────────────────────────────────
export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [password, setPassword] = useState("");
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [isPending, startTransition] = useTransition();

    const { level, score } = getStrength(password);
    const cfg = strengthConfig[level];

    const handleSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setGlobalError(null);
            setFieldErrors({});
            const formData = new FormData(e.currentTarget);

            startTransition(async () => {
                const result = await registerUser(formData);
                if (!result.success) {
                    setGlobalError(result.error);
                    if (result.fieldErrors) setFieldErrors(result.fieldErrors);
                }
                // On success, registerUser calls signIn which triggers a redirect
            });
        },
        []
    );

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-[420px] space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        Create your account
                    </h1>
                    <p className="text-sm text-slate-400">
                        Join RePaired and start listing or finding parts
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-1">
                        <Label htmlFor="name" className="text-slate-300 text-sm">
                            Full Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Alex Johnson"
                            autoComplete="name"
                            required
                            className={cn(
                                "bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20",
                                fieldErrors.name && "border-red-500 focus:border-red-500"
                            )}
                        />
                        {fieldErrors.name && (
                            <p className="text-xs text-red-400">{fieldErrors.name}</p>
                        )}
                    </div>

                    {/* Email */}
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
                            className={cn(
                                "bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20",
                                fieldErrors.email && "border-red-500 focus:border-red-500"
                            )}
                        />
                        {fieldErrors.email && (
                            <p className="text-xs text-red-400">{fieldErrors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-slate-300 text-sm">
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={cn(
                                    "bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 pr-10",
                                    fieldErrors.password && "border-red-500 focus:border-red-500"
                                )}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>

                        {/* Strength meter */}
                        {password.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-1.5">
                                    {[1, 2, 3, 4].map((bar) => (
                                        <div
                                            key={bar}
                                            className={cn(
                                                "h-1.5 flex-1 rounded-full transition-all duration-300",
                                                bar <= cfg.bars
                                                    ? cfg.color
                                                    : "bg-slate-700"
                                            )}
                                        />
                                    ))}
                                    <span
                                        className={cn(
                                            "text-xs font-medium ml-1 min-w-[70px] text-right transition-colors duration-200",
                                            level === "weak" && "text-red-400",
                                            level === "fair" && "text-amber-400",
                                            (level === "strong" || level === "very-strong") && "text-emerald-400"
                                        )}
                                    >
                                        {cfg.label}
                                    </span>
                                </div>

                                {/* Requirement checklist */}
                                <ul className="space-y-1">
                                    {CHECKS.map((check) => {
                                        const passed = check.test(password);
                                        return (
                                            <li
                                                key={check.label}
                                                className={cn(
                                                    "flex items-center gap-1.5 text-xs transition-colors duration-150",
                                                    passed ? "text-emerald-400" : "text-slate-500"
                                                )}
                                            >
                                                {passed ? (
                                                    <Check className="h-3 w-3 shrink-0" />
                                                ) : (
                                                    <X className="h-3 w-3 shrink-0 text-slate-600" />
                                                )}
                                                {check.label}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}

                        {fieldErrors.password && (
                            <p className="text-xs text-red-400">{fieldErrors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                        <Label htmlFor="confirmPassword" className="text-slate-300 text-sm">
                            Confirm Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirm ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                required
                                className={cn(
                                    "bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 pr-10",
                                    fieldErrors.confirmPassword && "border-red-500 focus:border-red-500"
                                )}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                aria-label={showConfirm ? "Hide password" : "Show password"}
                            >
                                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {fieldErrors.confirmPassword && (
                            <p className="text-xs text-red-400">{fieldErrors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Global error */}
                    {globalError && (
                        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                            {globalError}
                        </p>
                    )}

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={isPending || score < 5}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Create Account
                    </Button>

                    <p className="text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </form>

                {/* ToS */}
                <p className="px-4 text-center text-xs text-slate-600">
                    By creating an account, you agree to our{" "}
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
