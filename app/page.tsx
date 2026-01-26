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
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
                        style={{ backgroundImage: `url('${bgImage}')` }}
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">
                        {settings?.hero_headline || "Explore the Unseen World"}
                    </h1>
                    <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                        {settings?.hero_subheadline || "Premium tours, curated itineraries, and unforgettable experiences. Your journey begins here."}
                    </p>

                    <div className="bg-white/10 backdrop-blur-md p-2 rounded-full max-w-lg mx-auto border border-white/20 flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
                        <input
                            type="text"
                            placeholder="Where do you want to go?"
                            className="w-full flex-1 bg-transparent border-none px-6 py-3 text-white placeholder-gray-300 focus:outline-none text-center sm:text-left"
                        />
                        <Link href="/tours" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3 font-medium transition-colors">
                            Explore
                        </Link>
                    </div>
                </div>
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
