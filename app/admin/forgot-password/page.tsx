"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const supabase = createClientComponentClient();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/admin/update-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage("Check your email for the password reset link.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
            <div className="bg-slate-900 border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl">
                <Link
                    href="/admin/login"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Login
                </Link>

                <div className="text-center mb-8">
                    <div className="bg-blue-600/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-6 h-6 text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold">Forgot Password?</h1>
                    <p className="text-gray-400 mt-2">Enter your email and we'll send you a recovery link.</p>
                </div>

                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="admin@vromon.com"
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    {message && <p className="text-green-400 text-sm">{message}</p>}

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors flex justify-center items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Send Reset Link"}
                    </button>
                </form>
            </div>
        </div>
    );
}
