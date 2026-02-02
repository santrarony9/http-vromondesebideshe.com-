import Link from "next/link";
import { createSafeServerClient } from "@/lib/supabase-server";
import TourCard from "@/components/TourCard";
import { Tour } from "@/types/database";
import { ChevronDown } from "lucide-react";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function ToursPage({
    searchParams
}: {
    searchParams: { category?: string; sort?: string }
}) {
    const category = searchParams.category;
    const sort = searchParams.sort || "latest";
    const supabase = createSafeServerClient();

    let query = supabase
        .from('tours')
        .select('*');

    // Apply Filter
    if (category) {
        query = query.eq('category', category);
    }

    // Apply Sorting
    if (sort === "price_asc") {
        query = query.order('price', { ascending: true });
    } else if (sort === "price_desc") {
        query = query.order('price', { ascending: false });
    } else {
        query = query.order('created_at', { ascending: false });
    }

    const { data: tours, error } = await query;

    if (error) {
        return <div className="p-8 text-center text-red-500">Error loading tours. Please try again later.</div>;
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center mb-12">
                <h1 className="text-4xl font-black mb-4 uppercase tracking-tight">Discover Our Packages</h1>
                <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                    Choose from our wide range of premium tour packages designed to give you the best experience.
                </p>

                {/* Filter and Sort Bar */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 border-y border-white/5 py-8">
                    {/* Category Buttons */}
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/tours${sort ? `?sort=${sort}` : ""}`}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${!category ? "bg-white text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"
                                }`}
                        >
                            All
                        </Link>
                        <Link
                            href={`/tours?category=Domestic${sort ? `&sort=${sort}` : ""}`}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${category === "Domestic" ? "bg-white text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"
                                }`}
                        >
                            Domestic
                        </Link>
                        <Link
                            href={`/tours?category=International${sort ? `&sort=${sort}` : ""}`}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${category === "International" ? "bg-white text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"
                                }`}
                        >
                            International
                        </Link>
                    </div>

                    {/* Sort Dropdown (Simple Link-based) */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Sort By:</span>
                        <div className="relative group">
                            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-lg text-sm font-bold transition-all border border-white/10">
                                {sort === "price_asc" ? "Price: Low to High" : sort === "price_desc" ? "Price: High to Low" : "Latest"}
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50">
                                <Link
                                    href={`/tours?sort=latest${category ? `&category=${category}` : ""}`}
                                    className="block px-4 py-3 text-sm font-medium hover:bg-white/5 transition-colors"
                                >
                                    Latest
                                </Link>
                                <Link
                                    href={`/tours?sort=price_asc${category ? `&category=${category}` : ""}`}
                                    className="block px-4 py-3 text-sm font-medium hover:bg-white/5 transition-colors"
                                >
                                    Price: Low to High
                                </Link>
                                <Link
                                    href={`/tours?sort=price_desc${category ? `&category=${category}` : ""}`}
                                    className="block px-4 py-3 text-sm font-medium hover:bg-white/5 transition-colors"
                                >
                                    Price: High to Low
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {!tours || tours.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-xl font-bold mb-2">No tours found.</p>
                    <p className="text-sm text-gray-500">Try changing your filters or check back later.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tours.map((tour) => (
                        <TourCard key={tour.id} tour={tour} />
                    ))}
                </div>
            )}
        </div>
    );
}
