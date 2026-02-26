import Link from "next/link";
import { Sparkles, Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-slate-950">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2 group">
                            <Sparkles className="h-6 w-6 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
                            <span className="text-lg font-bold text-white">
                                RePaired
                            </span>
                        </Link>
                        <p className="text-sm text-slate-400">
                            Connecting people with orphaned earbuds and charging cases. Sustainable, affordable, eco-friendly.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/find" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                                    Find Parts
                                </Link>
                            </li>
                            <li>
                                <Link href="/donate" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                                    Donate
                                </Link>
                            </li>
                            <li>
                                <Link href="/profile" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                                    Profile
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                                    Safety Guidelines
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Connect</h3>
                        <div className="flex space-x-3">
                            <a
                                href="#"
                                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-200 hover:scale-110"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-200 hover:scale-110"
                                aria-label="GitHub"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-200 hover:scale-110"
                                aria-label="Email"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-8 pt-8 border-t border-slate-800">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-sm text-slate-400">
                            © {new Date().getFullYear()} RePaired. All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            <Link href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
