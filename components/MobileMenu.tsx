"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 hover:text-white p-2"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Menu Drawer */}
            <div className={`fixed top-16 left-0 w-full bg-slate-900 border-b border-white/10 z-50 transition-all duration-300 ease-in-out transform ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
                <div className="px-4 py-6 space-y-4 flex flex-col items-center">
                    <Link
                        href="/"
                        className="text-gray-300 hover:text-blue-400 font-medium text-lg w-full text-center py-2"
                        onClick={() => setIsOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        href="/tours"
                        className="text-gray-300 hover:text-blue-400 font-medium text-lg w-full text-center py-2"
                        onClick={() => setIsOpen(false)}
                    >
                        Tours
                    </Link>
                    <Link
                        href="/blog"
                        className="text-gray-300 hover:text-blue-400 font-medium text-lg w-full text-center py-2"
                        onClick={() => setIsOpen(false)}
                    >
                        Blog
                    </Link>

                    <Link
                        href="/about"
                        className="text-gray-300 hover:text-blue-400 font-medium text-lg w-full text-center py-2"
                        onClick={() => setIsOpen(false)}
                    >
                        About Us
                    </Link>

                    <div className="pt-4 w-full flex flex-col items-center gap-4 border-t border-white/10">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-sm">Theme</span>
                            <ThemeToggle />
                        </div>
                        <Link
                            href="/admin/login"
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full transition-colors text-white font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            <User className="h-5 w-5" />
                            <span>Sign In</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
