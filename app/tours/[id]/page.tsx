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
        <div className="min-h-screen pt-24 pb-12">
            {/* Hero Banner */}
            <div className="relative h-[60vh] w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={tour.image_url || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80'}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8 max-w-7xl mx-auto">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold mb-4 inline-block">
                        {tour.category}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{tour.title}</h1>
                    <div className="flex items-center space-x-6 text-lg">
                        <div className="flex items-center"><Clock className="mr-2" /> {tour.duration}</div>
                        <div className="font-bold text-blue-400 text-2xl">{formatCurrency(tour.price)}</div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">

                    <section>
                        <h2 className="text-2xl font-bold mb-6">Overview</h2>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            {tour.description}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-6">What's Included</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {amenities.map((item, i) => (
                                <div key={i} className="flex items-center space-x-3 bg-slate-900/50 p-4 rounded-lg">
                                    <CheckCircle2 className="text-green-500" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-6">Itinerary</h2>
                        <div className="space-y-6">
                            {/* Fallback if itinerary is not set or not an array */}
                            {Array.isArray(tour.itinerary) ? (
                                tour.itinerary.map((day: any, index: number) => (
                                    <div key={index} className="border-l-2 border-blue-500/30 pl-8 relative pb-8">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500" />
                                        <h3 className="text-xl font-bold mb-2">Day {index + 1}: {day.title}</h3>
                                        <p className="text-gray-400">{day.description}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400">Detailed itinerary available upon request.</p>
                            )}
                        </div>
                    </section>

                </div>

                {/* Sidebar Booking Form */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
                            <h3 className="text-xl font-bold mb-6">Book This Tour</h3>
                            <BookingForm
                                tourId={tour.id}
                                tourPrice={tour.price}
                                paymentQrUrl={paymentQrUrl}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
