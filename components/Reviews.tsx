"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Star, Quote } from "lucide-react";
import { GoogleIcon } from "./GoogleIcon";
import Image from "next/image";

export default function Reviews() {
    const [reviews, setReviews] = useState<any[]>([]);
    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchReviews = async () => {
            const { data } = await supabase
                .from('reviews')
                .select('*')
                .eq('is_approved', true)
                .order('created_at', { ascending: false })
                .limit(6);

            if (data) setReviews(data);
        };
        fetchReviews();
    }, []);

    if (reviews.length === 0) return null;

    return (
        <section className="py-20 bg-slate-900 border-t border-white/5">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    What Our Travelers Say
                </h2>
                <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
                    Real stories from real travelers about their experiences with Vromon Deshe Bideshe.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-slate-950 p-8 rounded-[2rem] border border-white/5 relative group hover:border-blue-500/20 transition-all duration-500 flex flex-col h-full shadow-2xl">
                            <Quote className="absolute top-8 right-8 w-10 h-10 text-blue-500/10 group-hover:text-blue-500/20 transition-colors" />

                            {review.source === 'google' && (
                                <div className="absolute top-8 left-8" title="Posted on Google">
                                    <GoogleIcon />
                                </div>
                            )}

                            <div className="flex text-yellow-500 mb-6 mt-8">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-800"}`} />
                                ))}
                            </div>

                            <p className="text-gray-300 mb-8 text-lg leading-relaxed flex-grow">
                                "{review.comment}"
                            </p>

                            {/* Traveler's own photos from the trip */}
                            {review.images && review.images.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {review.images.slice(0, 3).map((img: string, i: number) => (
                                        <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={img} alt="Traveler trip" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                                        </div>
                                    ))}
                                    {review.images.length > 3 && (
                                        <div className="w-16 h-16 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-xs text-gray-400 font-bold">
                                            +{review.images.length - 3}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                                {review.avatar_url ? (
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500/20">
                                        <Image
                                            src={review.avatar_url}
                                            alt={review.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center font-black text-white text-xl">
                                        {review.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-bold text-white text-lg">{review.name}</h4>
                                    <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">
                                        {review.source === 'google' ? 'Google Review' : 'Verified Trip'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
