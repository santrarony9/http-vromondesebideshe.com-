import { createSafeServerClient } from "@/lib/supabase-server";
import { cookies } from "next/headers";
import Link from "next/link";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

export default async function Footer() {
    const supabase = createSafeServerClient();
    const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 1).single();

    return (
        <footer className="bg-slate-950 border-t border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                            {settings?.website_name || "vromondesebideshe"}
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Your trusted partner for unforgettable journeys. Explore the world with comfort and style.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            {settings?.facebook_url && (
                                <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
                                    <Facebook className="w-5 h-5" />
                                </a>
                            )}
                            {settings?.instagram_url && (
                                <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                            {settings?.youtube_url && (
                                <a href={settings.youtube_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-red-500 transition-colors">
                                    <Youtube className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/tours" className="hover:text-blue-400">All Tours</Link></li>
                            <li><Link href="/about" className="hover:text-blue-400">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-blue-400">Contact Support</Link></li>
                            <li><Link href="/admin/login" className="hover:text-blue-400">Admin Portal</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-1 text-blue-500" />
                                <span>{settings?.address || "21A Central Road Jadavpur Kolkata 700032"}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-blue-500" />
                                <span>{settings?.email || "info@vromondesebideshe.com"}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-blue-500" />
                                <span>{settings?.phone || "6291164753, 8777679266"}</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
                        <div className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-white/5 border border-white/10 rounded px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
                            />
                            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 text-sm font-medium transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} {settings?.website_name || "vromondesebideshe"}. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
