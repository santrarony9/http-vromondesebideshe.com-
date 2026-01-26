"use client";

import Link from "next/link";
import { LayoutDashboard, MessageSquare, Settings, LogOut, Star, FileText, UserPlus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const supabase = createClientComponentClient({
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
    });

    // Pages that should NOT have the sidebar
    const isAuthPage = pathname?.startsWith('/admin/login') ||
        pathname?.startsWith('/admin/forgot-password') ||
        pathname?.startsWith('/admin/update-password');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            // Check if user is in whitelist
            const { data, error } = await supabase
                .from('admin_users')
                .select('email')
                .eq('email', session.user.email)
                .single();

            if (error || !data) {
                // Not in whitelist - Force Logout
                await supabase.auth.signOut();
                window.location.href = '/admin/login?error=unauthorized';
            }
            setLoading(false);
        };
        checkAuth();
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/admin/login';
    };

    if (isAuthPage) {
        return <>{children}</>;
    }

    if (loading) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-gray-200 flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-slate-900 hidden md:block fixed h-full z-20 pt-24">
                <div className="px-6 mb-6">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        Admin Portal
                    </h1>
                </div>
                <nav className="px-4 space-y-2">
                    <Link
                        href="/admin"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === '/admin' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/enquiries"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname?.startsWith('/admin/enquiries') ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <MessageSquare className="w-5 h-5" />
                        Enquiries
                    </Link>
                    <Link
                        href="/admin/settings"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname?.startsWith('/admin/settings') ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Settings className="w-5 h-5" />
                        Settings
                    </Link>
                    <Link
                        href="/admin/reviews"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname?.startsWith('/admin/reviews') ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Star className="w-5 h-5" />
                        Reviews
                    </Link>
                    <Link
                        href="/admin/blog"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname?.startsWith('/admin/blog') ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Link
                            href="/admin/users"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname?.startsWith('/admin/users') ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <UserPlus className="w-5 h-5" />
                            Manage Users
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors text-left"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                </nav>
            </aside>

            {/* Mobile Nav Placeholder (Optional) */}

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen">
                {children}
            </main>
        </div>
    );
}
