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
                        <div key={review.id} className="bg-slate-950 p-8 rounded-2xl border border-white/10 relative group">
                            <Quote className="absolute top-6 right-6 w-8 h-8 text-blue-900/40" />
                            {review.source === 'google' && (
                                <div className="absolute top-6 left-6" title="Posted on Google">
                                    <GoogleIcon />
                                </div>
                            )}

                            <div className="flex text-yellow-500 mb-4 mt-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-700"}`} />
                                ))}
                            </div>
                            <p className="text-gray-300 mb-6 italic">"{review.comment}"</p>
                            <div className="flex items-center gap-3">
                                {review.avatar_url ? (
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                        <Image
                                            src={review.avatar_url}
                                            alt={review.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                                        {review.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-bold text-white">{review.name}</h4>
                                    <p className="text-xs text-gray-500">
                                        {review.source === 'google' ? 'Google Review' : 'Verified Traveler'}
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
