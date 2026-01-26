import Link from "next/link";
import { User } from "lucide-react";
import { createSafeServerClient } from "@/lib/supabase-server";
import { cookies } from "next/headers";

import MobileMenu from "./MobileMenu";
import { ThemeToggle } from "@/components/ThemeToggle";

export const revalidate = 0;

export default async function Navbar() {
    const supabase = createSafeServerClient();
    const { data: settings } = await supabase.from('site_settings').select('website_name').eq('id', 1).single();

    const siteName = settings?.website_name || "vromondesebideshe";

    return (
        <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                            {siteName}
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="/" className="hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                            <Link href="/tours" className="hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Tours</Link>
                            <Link href="/about" className="hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">About Us</Link>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <ThemeToggle />
                        <Link href="/admin/login" className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition-colors text-sm font-medium text-white">
                            <User className="h-4 w-4" />
                            <span>Sign In</span>
                        </Link>
                    </div>

                    <MobileMenu />
                </div>
            </div>
        </nav>
    );
}
