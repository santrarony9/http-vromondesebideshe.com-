"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

interface TourFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function TourForm({ initialData, isEdit = false }: TourFormProps) {
    const router = useRouter();
    const supabase = createClientComponentClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Initialize state with initialData or defaults
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        price: initialData?.price || "",
        duration: initialData?.duration || "",
        category: initialData?.category || "International",
        image_url: initialData?.image_url || "",
        description: initialData?.description || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const slug = formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

            // Simplified itinerary (same as original code)
            const itinerary = initialData?.itinerary || [
                { title: "Arrival", description: "Arrive at the destination and transfer to hotel." },
                { title: "Sightseeing", description: "Full day sightseeing tour." },
                { title: "Departure", description: "Transfer to airport for departure." }
            ];

            const tourData = {
                title: formData.title,
                slug: initialData?.slug || slug, // Keep existing slug if editing
                price: Number(formData.price),
                duration: formData.duration,
                category: formData.category,
                description: formData.description,
                image_url: formData.image_url,
                itinerary
            };

            if (isEdit) {
                const { error: updateError } = await supabase
                    .from('tours')
                    .update(tourData)
                    .eq('id', initialData.id);
                if (updateError) throw updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('tours')
                    .insert(tourData);
                if (insertError) throw insertError;
            }

            router.push("/admin");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 border border-white/10 p-8 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-400">Package Title</label>
                    <input
                        required
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        type="text"
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Magical Maldives"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-400">Price ($)</label>
                    <input
                        required
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        type="number"
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="999"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-400">Duration</label>
                    <input
                        required
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        type="text"
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. 5 Days / 4 Nights"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-400">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-white"
                    >
                        <option value="International">International</option>
                        <option value="Domestic">Domestic</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 text-gray-400">Image URL</label>
                <input
                    required
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    type="url"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://..."
                />
                <p className="text-xs text-gray-500 mt-1">Use a hosted image link (e.g. Unsplash or Supabase Storage public URL)</p>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 text-gray-400">Description</label>
                <textarea
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Detailed overview of the tour..."
                />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
                disabled={loading}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                {isEdit ? "Update Package" : "Create Package"}
            </button>
        </form>
    );
}
