import { createSafeServerClient } from "@/lib/supabase-server";
import TourCard from "@/components/TourCard";
import { Tour } from "@/types/database";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function ToursPage() {
    const supabase = createSafeServerClient();
    const { data: tours, error } = await supabase
        .from('tours')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return <div className="p-8 text-center text-red-500">Error loading tours. Please try again later.</div>;
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">Discover Our Packages</h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Choose from our wide range of premium tour packages designed to give you the best experience.
                </p>
            </div>

            {!tours || tours.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-xl">No tours available at the moment.</p>
                    <p className="text-sm mt-2">Check back soon!</p>
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
