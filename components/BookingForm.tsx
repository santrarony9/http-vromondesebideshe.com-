"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function BookingForm({ tourId, tourPrice, paymentQrUrl }: { tourId: string, tourPrice: number, paymentQrUrl?: string }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    async function handlePayment(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const customerData = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            date: formData.get("date") as string,
        };

        try {
            await saveBooking(customerData);
        } catch (err: any) {
            setError(err.message || "Booking failed");
            setLoading(false);
        }
    }

    async function saveBooking(customerData: any) {
        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                body: JSON.stringify({
                    tour_id: tourId,
                    customer_name: customerData.name,
                    customer_email: customerData.email,
                    customer_phone: customerData.phone,
                    travel_date: customerData.date,
                    payment_status: "pending", // Manual payment status
                    amount: tourPrice
                }),
            });

            if (!res.ok) throw new Error("Booking save failed");
            setSuccess(true);
        } catch (err) {
            setError("Booking failed to save. Please try again or contact support.");
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="text-center py-8">
                <div className="bg-green-500/20 text-green-400 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    ✓
                </div>
                <h3 className="text-xl font-bold mb-2">Booking Request Received!</h3>
                <p className="text-sm text-gray-400">Please complete the payment via QR code if you haven't already. We will contact you shortly to confirm.</p>
            </div>
        );
    }

    return (
        <div className="relative">
            <form onSubmit={handlePayment} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Full Name</label>
                    <input required name="name" type="text" className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Email Address</label>
                    <input required name="email" type="email" className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@example.com" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Phone Number</label>
                    <input required name="phone" type="tel" className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+880 1711..." />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Preferred Travel Date</label>
                    <input required name="date" type="date" className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none mb-4" />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                {paymentQrUrl && (
                    <div className="mb-6 border border-white/10 rounded-lg p-4 bg-slate-800/50 text-center">
                        <p className="text-sm font-medium text-yellow-400 mb-2">Scan to Pay</p>
                        <div className="bg-white p-2 rounded-lg inline-block mb-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={paymentQrUrl} alt="Payment QR" className="w-32 h-32 object-contain" />
                        </div>
                        <p className="text-xs text-gray-400">Amount: {formatCurrency(tourPrice)}</p>
                        <p className="text-xs text-gray-500 mt-1">Please use your name as reference.</p>
                    </div>
                )}

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
                >
                    {loading ? <Loader2 className="animate-spin" /> : `Book Now`}
                </button>
            </form>
        </div>
    );
}
