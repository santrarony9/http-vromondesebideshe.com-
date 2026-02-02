"use client";
// Verified Fix Update

import React, { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface SettingsProps {
    initialData: any;
}

export default function SettingsForm({ initialData }: SettingsProps) {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        website_name: initialData?.website_name || "",
        address: initialData?.address || "21A Central Road Jadavpur Kolkata 700032",
        phone: initialData?.phone || "6291164753, 8777679266",
        email: initialData?.email || "",
        facebook_url: initialData?.facebook_url || "",
        instagram_url: initialData?.instagram_url || "",
        youtube_url: initialData?.youtube_url || "",
        about_title: initialData?.about_title || "",
        about_description: initialData?.about_description || "",
        hero_headline: initialData?.hero_headline || "",
        hero_subheadline: initialData?.hero_subheadline || "",
        hero_image_url: initialData?.hero_image_url || "",
        payment_qr_url: initialData?.payment_qr_url || "",
        whatsapp_number: initialData?.whatsapp_number || "",
        google_map_url: initialData?.google_map_url || "",
        hero_badge_text: initialData?.hero_badge_text || "Discover Your Next Adventure",
        tours_heading: initialData?.tours_heading || "Popular Destinations",
        tours_subheading: initialData?.tours_subheading || "Handpicked tours for your next adventure",
        feature_1_text: initialData?.feature_1_text || "Curated Types",
        feature_2_text: initialData?.feature_2_text || "Local Guides",
        feature_3_text: initialData?.feature_3_text || "Premium Travel",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from("site_settings")
                .update(formData)
                .eq('id', 1);

            if (error) throw error;

            alert("Settings updated successfully!");
            router.refresh();
        } catch (error: any) {
            alert("Error updating settings: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            <div className="bg-slate-900 p-6 rounded-xl border border-white/10 space-y-4">
                <h2 className="text-xl font-semibold mb-4 text-blue-400">General Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">Website Name</label>
                        <input
                            name="website_name"
                            value={formData.website_name}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">Phone Number</label>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">Email Address</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">Physical Address</label>
                        <input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-white/10 space-y-4">
                <h2 className="text-xl font-semibold mb-4 text-purple-400">Social Media Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">Facebook URL</label>
                        <input
                            name="facebook_url"
                            value={formData.facebook_url}
                            onChange={handleChange}
                            placeholder="https://facebook.com/..."
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">Instagram URL</label>
                        <input
                            name="instagram_url"
                            value={formData.instagram_url}
                            onChange={handleChange}
                            placeholder="https://instagram.com/..."
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">YouTube URL</label>
                        <input
                            name="youtube_url"
                            value={formData.youtube_url}
                            onChange={handleChange}
                            placeholder="https://youtube.com/..."
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-white/10 space-y-4">
                <h2 className="text-xl font-semibold mb-4 text-yellow-400">Payment Settings</h2>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-400">Payment QR Code URL</label>
                    <input
                        name="payment_qr_url"
                        value={formData.payment_qr_url}
                        onChange={handleChange}
                        placeholder="https://your-image-host.com/qr-code.jpg"
                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Direct link to your GPay/PhonePe QR code image.</p>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-white/10 space-y-4">
                <h2 className="text-xl font-semibold mb-4 text-emerald-400">About Us Page Content</h2>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-400">Headline / Title</label>
                    <input
                        name="about_title"
                        value={formData.about_title}
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-400">Story / Description</label>
                    <textarea
                        name="about_description"
                        value={formData.about_description}
                        onChange={handleChange}
                        rows={6}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-white/10 space-y-4">
                <h2 className="text-xl font-semibold mb-4 text-green-400">Communication & Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">WhatsApp Number</label>
                        <input
                            name="whatsapp_number"
                            value={formData.whatsapp_number}
                            onChange={handleChange}
                            placeholder="e.g. 919876543210"
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Include country code (no +). Used for Floating Chat.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">Google Maps Embed URL</label>
                        <input
                            name="google_map_url"
                            value={formData.google_map_url}
                            onChange={handleChange}
                            placeholder="https://www.google.com/maps/embed?..."
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Paste the 'Embed a map' HTML source link here.</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-white/10 space-y-4">
                <h2 className="text-xl font-semibold mb-4 text-cyan-400">Homepage Text Control</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">Hero Badge Text</label>
                        <input
                            name="hero_badge_text"
                            value={formData.hero_badge_text}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-400">Hero Headline</label>
                            <input
                                name="hero_headline"
                                value={formData.hero_headline}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-400">Hero Sub-headline</label>
                            <input
                                name="hero_subheadline"
                                value={formData.hero_subheadline}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-400">Tours Section Title</label>
                            <input
                                name="tours_heading"
                                value={formData.tours_heading}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-400">Tours Section Subtitle</label>
                            <input
                                name="tours_subheading"
                                value={formData.tours_subheading}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-400">Feature 1 Text</label>
                            <input
                                name="feature_1_text"
                                value={formData.feature_1_text}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-400">Feature 2 Text</label>
                            <input
                                name="feature_2_text"
                                value={formData.feature_2_text}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-400">Feature 3 Text</label>
                            <input
                                name="feature_3_text"
                                value={formData.feature_3_text}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">Background Image URL</label>
                        <input
                            name="hero_image_url"
                            value={formData.hero_image_url}
                            onChange={handleChange}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Paste a link to a high-quality image.</p>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Settings
            </button>
        </form>
    );
}
