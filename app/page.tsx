import Link from "next/link";
import { ArrowRight, MapPin, Calendar, Clock, Loader2 } from "lucide-react";
import { createSafeServerClient } from "@/lib/supabase-server";
import TourCard from "@/components/TourCard";
import Reviews from "@/components/Reviews";

export const revalidate = 0;

export default async function Home() {
    const supabase = createSafeServerClient();

    // Parallel fetching for performance
    const [settingsRes, toursRes] = await Promise.all([
        supabase.from('site_settings').select('*').eq('id', 1).single(),
        supabase.from('tours').select('*').order('created_at', { ascending: false }).limit(3)
    ]);

    const settings = settingsRes.data;
    const tours = toursRes.data || [];

    const bgImage = settings?.hero_image_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80';

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={bgImage}
                    alt="Travel destination"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 z-10" />

                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                    <div className="space-y-0 text-white uppercase tracking-tight">
                        <span className="text-xl md:text-2xl font-black block opacity-80">Start Your</span>
                        <h1 className="text-7xl md:text-[120px] font-black leading-none mb-2 bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                            JOURNEY
                        </h1>
                        <span className="text-xl md:text-2xl font-black block mb-12 opacity-80">With Us</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
                        <Link
                            href="/tours?category=Domestic"
                            className="w-full sm:w-auto bg-blue-600 text-white text-lg font-bold px-10 py-5 rounded-full hover:bg-blue-700 transition-all shadow-2xl hover:scale-105 active:scale-95"
                        >
                            Domestic Tours
                        </Link>
                        <Link
                            href="/tours?category=International"
                            className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white text-lg font-bold px-10 py-5 rounded-full hover:bg-white/20 transition-all shadow-2xl hover:scale-105 active:scale-95"
                        >
                            International Tours
                        </Link>
                    </div>
                </div>

                {/* Decorative bottom gradient */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-950 to-transparent z-20" />
            </section>

            {/* Featured Tours Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Popular Destinations</h2>
                        <p className="text-gray-400">Handpicked tours for your next adventure</p>
                    </div>
                    <Link href="/tours" className="hidden md:flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                        View All Tours <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>

                {tours.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tours.map((tour) => (
                            <TourCard key={tour.id} tour={tour} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-900 rounded-2xl border border-white/5">
                        <div className="text-gray-500 mb-4">No tours available yet.</div>
                        <Link href="/admin/tours/new" className="text-blue-400 hover:underline">
                            Add your first tour in Admin Dashboard
                        </Link>
                    </div>
                )}
            </section>

            {/* Reviews Section */}
            <Reviews />
        </div>
    );
}
