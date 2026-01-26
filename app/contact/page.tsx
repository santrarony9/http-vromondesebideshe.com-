"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2, Send } from "lucide-react";

export default function ContactPage() {
    const supabase = createClientComponentClient();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
    const [mapUrl, setMapUrl] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase.from('site_settings').select('google_map_url').eq('id', 1).single();
            if (data?.google_map_url) setMapUrl(data.google_map_url);
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from('enquiries').insert([formData]);
            if (error) throw error;

            // Send Email to Admin
            await fetch('/api/send-enquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            alert("Message sent! We will contact you shortly.");
            setFormData({ name: "", email: "", phone: "", message: "" });
        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 pt-24 px-4 text-gray-200">
            <div className="max-w-2xl mx-auto bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
                <h1 className="text-3xl font-bold text-white mb-6">Contact Us</h1>
                <p className="text-gray-400 mb-8">Have questions about a trip? Send us a message.</p>

                {mapUrl && (
                    <div className="w-full h-64 bg-slate-800 rounded-xl mb-8 overflow-hidden border border-white/10">
                        <iframe
                            src={mapUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            placeholder="Your Name"
                            required
                            className="bg-slate-800 border border-white/10 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                            placeholder="Phone Number"
                            required
                            className="bg-slate-800 border border-white/10 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <input
                        placeholder="Email Address"
                        type="email"
                        required
                        className="bg-slate-800 border border-white/10 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <textarea
                        placeholder="How can we help you?"
                        required
                        rows={5}
                        className="bg-slate-800 border border-white/10 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                    <button
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Send className="w-4 h-4" />}
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
}
