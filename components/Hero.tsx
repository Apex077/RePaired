"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Recycle } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface Trail {
    x: number;
    y: number;
    opacity: number;
    id: number;
}

export default function Hero({ firstName }: { firstName?: string | null }) {
    const trailsRef = useRef<Trail[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const lastAddTime = useRef(0);
    const idCounter = useRef(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Only create trails when mouse is over the hero section
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const isOverHero =
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom;

            if (!isOverHero) return;

            const now = Date.now();
            // Add new trail every 50ms for smooth effect
            if (now - lastAddTime.current > 50) {
                trailsRef.current.push({
                    x: e.clientX,
                    y: e.clientY,
                    opacity: 1,
                    id: idCounter.current++,
                });
                lastAddTime.current = now;

                // Limit number of trails
                if (trailsRef.current.length > 20) {
                    trailsRef.current.shift();
                }
            }
        };

        // Animation loop to fade out trails
        const animate = () => {
            if (containerRef.current) {
                // Clear previous trails
                containerRef.current.innerHTML = '';

                // Update and render trails
                trailsRef.current = trailsRef.current.filter(trail => {
                    trail.opacity -= 0.02; // Fade out speed

                    if (trail.opacity > 0) {
                        // Create trail element
                        const trailEl = document.createElement('div');
                        trailEl.style.cssText = `
              position: fixed;
              left: ${trail.x}px;
              top: ${trail.y}px;
              width: 250px;
              height: 250px;
              transform: translate(-50%, -50%);
              background: radial-gradient(circle, rgba(16, 185, 129, ${trail.opacity * 0.3}) 0%, rgba(16, 185, 129, ${trail.opacity * 0.15}) 30%, transparent 70%);
              filter: blur(40px);
              pointer-events: none;
              z-index: 50;
            `;
                        containerRef.current?.appendChild(trailEl);
                        return true;
                    }
                    return false;
                });
            }
            requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);
        animate();

        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Trail container */}
            <div ref={containerRef} className="fixed inset-0 pointer-events-none" />

            <div className="container relative z-10 px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 shadow-lg animate-scale-in">
                        <Recycle className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-300">
                            Reducing E-Waste, One Earbud at a Time
                        </span>
                    </div>

                    {/* Heading */}
                    <div className="space-y-4 max-w-4xl">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-slide-up">
                            {firstName ? (
                                <>
                                    <span className="text-emerald-400">
                                        Welcome back, {firstName}!
                                    </span>
                                    <br />
                                    <span className="text-white">
                                        Ready to Find Your Match?
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="text-emerald-400">
                                        Lost an Earbud?
                                    </span>
                                    <br />
                                    <span className="text-white">
                                        We&apos;ll Help You Find Its Match
                                    </span>
                                </>
                            )}
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto animate-slide-up delay-100">
                            {firstName
                                ? "Browse the latest listings or post your spare parts to help the community."
                                : "Join the community connecting people with orphaned earbuds and charging cases. Sustainable, affordable, and eco-friendly."
                            }
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 animate-slide-up delay-200">
                        <Link href="/find">
                            <Button
                                size="lg"
                                className="group bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105"
                            >
                                <Sparkles className="w-5 h-5 mr-2" />
                                Find a Part
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/donate">
                            <Button
                                size="lg"
                                variant="outline"
                                className="group border-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500 shadow-lg transition-all duration-300 hover:scale-105"
                            >
                                I Have a Spare
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 md:gap-16 pt-12 animate-fade-in delay-300">
                        <div className="space-y-1">
                            <div className="text-3xl md:text-4xl font-bold text-emerald-400">
                                1,200+
                            </div>
                            <div className="text-sm text-slate-400">
                                Successful Matches
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-3xl md:text-4xl font-bold text-blue-400">
                                500+
                            </div>
                            <div className="text-sm text-slate-400">
                                Active Listings
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-3xl md:text-4xl font-bold text-purple-400">
                                95%
                            </div>
                            <div className="text-sm text-slate-400">
                                Satisfaction Rate
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-2">
                    <div className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
                </div>
            </div>
        </section>
    );
}
