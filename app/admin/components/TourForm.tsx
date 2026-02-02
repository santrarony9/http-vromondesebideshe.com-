"use client";

import React, { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

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
        original_price: initialData?.original_price || "",
        rating: initialData?.rating || "5",
    });

    const [itinerary, setItinerary] = useState<any[]>(initialData?.itinerary || [
        { title: "Arrival", description: "Arrive at the destination and transfer to hotel." }
    ]);
    const [addOns, setAddOns] = useState<any[]>(initialData?.add_ons || []);
    const [hotels, setHotels] = useState<any[]>(initialData?.hotels || []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const addItineraryDay = () => setItinerary([...itinerary, { title: "", description: "" }]);
    const removeItineraryDay = (index: number) => setItinerary(itinerary.filter((_, i) => i !== index));
    const updateItineraryDay = (index: number, field: string, value: string) => {
        const newItinerary = [...itinerary];
        newItinerary[index] = { ...newItinerary[index], [field]: value };
        setItinerary(newItinerary);
    };

    const addAddOn = () => setAddOns([...addOns, { name: "", price: 0 }]);
    const removeAddOn = (index: number) => setAddOns(addOns.filter((_, i) => i !== index));
    const updateAddOn = (index: number, field: string, value: any) => {
        const newAddOns = [...addOns];
        newAddOns[index] = { ...newAddOns[index], [field]: value };
        setAddOns(newAddOns);
    };

    const addHotel = () => setHotels([...hotels, { name: "", image_url: "", description: "" }]);
    const removeHotel = (index: number) => setHotels(hotels.filter((_, i) => i !== index));
    const updateHotel = (index: number, field: string, value: string) => {
        const newHotels = [...hotels];
        newHotels[index] = { ...newHotels[index], [field]: value };
        setHotels(newHotels);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const slug = formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

            const tourData = {
                title: formData.title,
                slug: initialData?.slug || slug, // Keep existing slug if editing
                price: Number(formData.price),
                duration: formData.duration,
                category: formData.category,
                description: formData.description,
                image_url: formData.image_url,
                original_price: formData.original_price ? Number(formData.original_price) : null,
                rating: Number(formData.rating),
                itinerary,
                add_ons: addOns,
                hotels
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
        <form onSubmit={handleSubmit} className="space-y-12 bg-slate-900 border border-white/10 p-8 rounded-xl max-w-5xl mx-auto">
            <div className="space-y-6">
                <h2 className="text-xl font-bold border-b border-white/10 pb-2">Basic Information</h2>
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
                        <label className="block text-sm font-medium mb-1 text-gray-400">Current Price ($)</label>
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

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">Original Price ($) - Optional</label>
                        <input
                            name="original_price"
                            value={formData.original_price}
                            onChange={handleChange}
                            type="number"
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="1299"
                        />
                    </div>

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

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">Star Rating (1-5)</label>
                        <input
                            required
                            name="rating"
                            value={formData.rating}
                            onChange={handleChange}
                            type="number"
                            min="1"
                            max="5"
                            step="0.1"
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="5"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-400">Cover Image</label>
                    <ImageUpload
                        value={formData.image_url}
                        onChange={(url: string) => setFormData(prev => ({ ...prev, image_url: url }))}
                    />
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
            </div>

            {/* Itinerary Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <h2 className="text-xl font-bold">Itinerary Builder</h2>
                    <button
                        type="button"
                        onClick={addItineraryDay}
                        className="text-sm bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg hover:bg-blue-600/30 transition-colors"
                    >
                        + Add Day
                    </button>
                </div>
                <div className="space-y-4">
                    {itinerary.map((day: any, index: number) => (
                        <div key={index} className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3 relative group">
                            <button
                                type="button"
                                onClick={() => removeItineraryDay(index)}
                                className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                Remove
                            </button>
                            <h3 className="text-blue-400 font-bold">Day {index + 1}</h3>
                            <input
                                placeholder="Day Title (e.g. Arrival & City Tour)"
                                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2"
                                value={day.title}
                                onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
                            />
                            <textarea
                                placeholder="What happens on this day?"
                                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2 h-20"
                                value={day.description}
                                onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Hotels Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <h2 className="text-xl font-bold">Stay at Premium Hotels (Gallery)</h2>
                    <button
                        type="button"
                        onClick={addHotel}
                        className="text-sm bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg hover:bg-blue-600/30 transition-colors"
                    >
                        + Add Hotel
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {hotels.map((hotel: any, index: number) => (
                        <div key={index} className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3 relative group">
                            <button
                                type="button"
                                onClick={() => removeHotel(index)}
                                className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                                Remove
                            </button>
                            <input
                                placeholder="Hotel Name"
                                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2"
                                value={hotel.name}
                                onChange={(e) => updateHotel(index, 'name', e.target.value)}
                            />
                            <div className="h-40">
                                <ImageUpload
                                    value={hotel.image_url}
                                    onChange={(url: string) => updateHotel(index, 'image_url', url)}
                                    className="h-full"
                                />
                            </div>
                            <input
                                placeholder="Brief Description (Optional)"
                                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2 text-sm"
                                value={hotel.description}
                                onChange={(e) => updateHotel(index, 'description', e.target.value)}
                            />
                        </div>
                    ))}
                </div>
                {hotels.length === 0 && <p className="text-gray-500 text-center py-4 italic">No hotels added yet. Click "+ Add Hotel" to showcase stays.</p>}
            </div>

            {/* Add-ons Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <h2 className="text-xl font-bold">Dynamic Add-ons (Extras)</h2>
                    <button
                        type="button"
                        onClick={addAddOn}
                        className="text-sm bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg hover:bg-blue-600/30 transition-colors"
                    >
                        + Add Extra
                    </button>
                </div>
                <div className="space-y-3">
                    {addOns.map((addon: any, index: number) => (
                        <div key={index} className="flex gap-4 items-center">
                            <input
                                placeholder="e.g. Airport Transfer"
                                className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2"
                                value={addon.name}
                                onChange={(e) => updateAddOn(index, 'name', e.target.value)}
                            />
                            <div className="w-32 relative">
                                <span className="absolute left-3 top-2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    placeholder="Price"
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg pl-6 pr-4 py-2"
                                    value={addon.price}
                                    onChange={(e) => updateAddOn(index, 'price', Number(e.target.value))}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeAddOn(index)}
                                className="text-red-500 hover:text-red-400 p-2"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-6">
                {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2 text-lg"
                >
                    {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Save className="w-6 h-6" />}
                    {isEdit ? "Update Package" : "Create Package"}
                </button>
            </div>
        </form>
    );
}
