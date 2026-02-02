import { createSafeServerClient } from "@/lib/supabase-server";
import { formatCurrency } from "@/lib/utils";
import { notFound } from "next/navigation";
import BookingForm from "@/components/BookingForm";
import { Clock, MapPin, CheckCircle2 } from "lucide-react";

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function TourDetailsPage({ params }: { params: { id: string } }) {
    const supabase = createSafeServerClient();
    const [tourRes, settingsRes] = await Promise.all([
        supabase.from('tours').select('*').eq('id', params.id).single(),
        supabase.from('site_settings').select('payment_qr_url').eq('id', 1).single()
    ]);

    const tour = tourRes.data;
    const paymentQrUrl = settingsRes.data?.payment_qr_url;

    if (!tour) {
        notFound();
    }

    const amenities = ["5 Star Accommodation", "Breakfast & Dinner", "Airport Transfers", "English Speaking Guide"];

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#020617] text-white">
            {/* Hero Banner */}
            <div className="relative h-[70vh] w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={tour.image_url || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80'}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8 max-w-7xl mx-auto">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                            {tour.category}
                        </span>
                        {tour.rating && (
                            <span className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                ★ {tour.rating}
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight">{tour.title}</h1>
                    <div className="flex flex-wrap items-center gap-8 text-lg text-gray-300">
                        <div className="flex items-center bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                            <Clock className="mr-2 text-blue-400" /> {tour.duration}
                        </div>
                        <div className="flex flex-col">
                            {tour.original_price && (
                                <span className="text-sm text-gray-500 line-through decoration-red-500/50">
                                    {formatCurrency(tour.original_price)}
                                </span>
                            )}
                            <div className="font-black text-blue-400 text-3xl">
                                {formatCurrency(tour.price)}
                                <span className="text-sm text-gray-500 font-normal ml-2">/ person</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-16">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-20">

                    <section>
                        <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                            <span className="w-2 h-8 bg-blue-600 rounded-full" />
                            Overview
                        </h2>
                        <p className="text-gray-400 leading-relaxed text-xl font-medium italic border-l-4 border-blue-600/20 pl-6">
                            {tour.description}
                        </p>
                    </section>

                    {/* Stay at Premium Hotels Section */}
                    {tour.hotels && tour.hotels.length > 0 && (
                        <section>
                            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                                <span className="w-2 h-8 bg-blue-600 rounded-full" />
                                Stay at Premium Hotels
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {tour.hotels.map((hotel: any, i: number) => (
                                    <div key={i} className="group bg-slate-900/50 border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-500">
                                        <div className="relative h-64 overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={hotel.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80'}
                                                alt={hotel.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60" />
                                            <div className="absolute bottom-4 left-6">
                                                <h3 className="text-xl font-bold text-white">{hotel.name}</h3>
                                            </div>
                                        </div>
                                        {hotel.description && (
                                            <div className="p-6">
                                                <p className="text-gray-400 text-sm leading-relaxed">{hotel.description}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section>
                        <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                            <span className="w-2 h-8 bg-blue-600 rounded-full" />
                            What's Included
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {amenities.map((item, i) => (
                                <div key={i} className="flex items-center space-x-4 bg-slate-900/50 border border-white/5 p-5 rounded-2xl hover:bg-slate-800/50 transition-colors group">
                                    <div className="bg-green-500/10 p-2 rounded-full group-hover:bg-green-500/20 transition-colors">
                                        <CheckCircle2 className="text-green-500 w-6 h-6" />
                                    </div>
                                    <span className="font-bold text-gray-300">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                            <span className="w-2 h-8 bg-blue-600 rounded-full" />
                            Day-by-Day Itinerary
                        </h2>
                        <div className="space-y-0">
                            {Array.isArray(tour.itinerary) ? (
                                tour.itinerary.map((day: any, index: number) => (
                                    <div key={index} className="flex gap-8 group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-black text-xl z-10 group-hover:scale-110 transition-transform">
                                                {index + 1}
                                            </div>
                                            {index !== tour.itinerary.length - 1 && (
                                                <div className="w-0.5 flex-1 bg-gradient-to-b from-blue-600 to-transparent my-2" />
                                            )}
                                        </div>
                                        <div className="pb-12 flex-1">
                                            <h3 className="text-2xl font-bold mb-4 text-blue-400 tracking-tight group-hover:translate-x-2 transition-transform">
                                                {day.title}
                                            </h3>
                                            <div className="bg-slate-900/30 border border-white/5 p-6 rounded-2xl backdrop-blur-sm group-hover:border-white/10 transition-colors">
                                                <p className="text-gray-400 leading-relaxed text-lg">{day.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-slate-900/50 border border-dashed border-white/10 p-8 rounded-2xl text-center">
                                    <p className="text-gray-500 text-lg">Detailed itinerary available upon request.</p>
                                </div>
                            )}
                        </div>
                    </section>

                </div>

                {/* Sidebar Booking Form */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl -mr-16 -mt-16 rounded-full" />
                            <h3 className="text-2xl font-black mb-8 flex items-center gap-2">
                                Book This Tour
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            </h3>

                            {/* Add-ons Preview if they exist */}
                            {tour.add_ons && tour.add_ons.length > 0 && (
                                <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Available Add-ons</p>
                                    <div className="space-y-3">
                                        {tour.add_ons.map((addon: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-400">{addon.name}</span>
                                                <span className="text-blue-400 font-bold">+{formatCurrency(addon.price)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <BookingForm
                                tourId={tour.id}
                                tourPrice={tour.price}
                                paymentQrUrl={paymentQrUrl}
                            />

                            <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4 text-gray-500 text-sm">
                                <MapPin className="w-5 h-5 text-blue-500" />
                                <span>Multi-destination tour package</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
