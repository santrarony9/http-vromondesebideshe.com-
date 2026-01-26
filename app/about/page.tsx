import { createSafeServerClient } from "@/lib/supabase-server";
import Image from "next/image";

export const revalidate = 0;

export default async function AboutPage() {
    // Fetch settings
    const supabase = createSafeServerClient();
    const { data: settings } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single();

    return (
        <div className="min-h-screen bg-slate-950 text-gray-200">
            {/* Hero Section */}
            <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/20 z-0" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 z-10" />

                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">
                        {settings?.about_title || "Our Journey"}
                    </h1>
                    <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
                        Discover the story behind your perfect vacation.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 py-16 -mt-32 relative z-30">
                <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
                    <div className="prose prose-invert max-w-none">
                        <p className="text-lg leading-relaxed whitespace-pre-wrap text-gray-300">
                            {settings?.about_description || "Welcome to our travel agency. We are dedicated to providing you with the best travel experiences..."}
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 pt-12">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-4">Contact Us</h3>
                            <div className="space-y-2 text-gray-400">
                                <p><strong className="text-blue-400">Address:</strong> {settings?.address || "21A Central Road Jadavpur Kolkata 700032"}</p>
                                <p><strong className="text-blue-400">Phone:</strong> {settings?.phone || "6291164753, 8777679266"}</p>
                                <p><strong className="text-blue-400">Email:</strong> {settings?.email || "info@vromondesebideshe.com"}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-4">Follow Us</h3>
                            <div className="flex gap-4">
                                {settings?.facebook_url && (
                                    <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-white transition-colors">Facebook</a>
                                )}
                                {settings?.instagram_url && (
                                    <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-white transition-colors">Instagram</a>
                                )}
                                {settings?.youtube_url && (
                                    <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-white transition-colors">YouTube</a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
