"use client";

import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2, Trash2, CheckCircle, XCircle, Plus, X } from "lucide-react";
import Image from "next/image";
import ImageUpload from "@/components/ui/ImageUpload";

export default function AdminReviews() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newReview, setNewReview] = useState({
        name: "",
        rating: 5,
        comment: "",
        source: "google",
        avatar_url: "",
        images: [] as string[],
        is_approved: true
    });

    const supabase = createClientComponentClient();

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setReviews(data);
        setLoading(false);
    };

    const toggleApproval = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('reviews')
            .update({ is_approved: !currentStatus })
            .eq('id', id);

        if (!error) fetchReviews();
    };

    const deleteReview = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;

        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', id);

        if (!error) fetchReviews();
    };

    const handleCreateReview = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase
            .from('reviews')
            .insert([newReview]);

        if (!error) {
            setShowForm(false);
            setNewReview({ name: "", rating: 5, comment: "", source: "google", avatar_url: "", images: [], is_approved: true });
            fetchReviews();
        } else {
            alert("Error creating review: " + error.message);
        }
    };

    const addReviewImage = (url: string) => {
        setNewReview(prev => ({ ...prev, images: [...prev.images, url] }));
    };

    const removeReviewImage = (index: number) => {
        setNewReview(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-500 w-12 h-12" /></div>;

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-950 text-white">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black mb-2">Customer Reviews</h1>
                    <p className="text-gray-400">Manage and approve traveler experiences</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 font-bold"
                >
                    {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {showForm ? "Cancel" : "Add New Review"}
                </button>
            </div>

            {showForm && (
                <div className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] mb-12 animate-in fade-in shadow-2xl">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                        Manual Review Entry
                    </h2>
                    <form onSubmit={handleCreateReview} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Traveler Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-800 border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={newReview.name}
                                    onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Star Rating</label>
                                <select
                                    className="w-full bg-slate-800 border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white"
                                    value={newReview.rating}
                                    onChange={e => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                                >
                                    {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Review Source</label>
                                <select
                                    className="w-full bg-slate-800 border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white"
                                    value={newReview.source}
                                    onChange={e => setNewReview({ ...newReview, source: e.target.value })}
                                >
                                    <option value="google">Google</option>
                                    <option value="website">Direct Website</option>
                                    <option value="facebook">Facebook</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Avatar (Optional)</label>
                                <ImageUpload
                                    value={newReview.avatar_url}
                                    onChange={(url: string) => setNewReview({ ...newReview, avatar_url: url })}
                                    className="h-32 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Traveler Photos (Optional Gallery)</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <ImageUpload
                                        value=""
                                        onChange={(url: string) => addReviewImage(url)}
                                        className="h-32"
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        {newReview.images.map((img: string, i: number) => (
                                            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 group">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={img} alt="review" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeReviewImage(i)}
                                                    className="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-4 h-4 text-white" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Comment</label>
                            <textarea
                                required
                                className="w-full bg-slate-800 border-white/10 rounded-xl px-4 py-3 h-32 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={newReview.comment}
                                onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                                placeholder="What did the traveler say about their experience?"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-xl font-black transition-all shadow-lg shadow-green-600/20">
                                Save Review
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-8">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] flex flex-col md:flex-row justify-between gap-8 shadow-xl hover:border-white/20 transition-all">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-blue-500/30 bg-slate-800 flex items-center justify-center font-bold text-gray-500 text-2xl uppercase">
                                    {review.avatar_url ? (
                                        <Image src={review.avatar_url} alt={review.name} fill className="object-cover" />
                                    ) : (
                                        review.name.charAt(0)
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-black text-xl">{review.name}</h3>
                                    <div className="flex text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="text-xl">{i < review.rating ? "★" : "☆"}</span>
                                        ))}
                                    </div>
                                </div>
                                <span className="ml-auto md:ml-4 bg-slate-800 text-gray-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {review.source}
                                </span>
                            </div>

                            <p className="text-gray-300 text-lg leading-relaxed">{review.comment}</p>

                            {/* Display Review Images */}
                            {review.images && review.images.length > 0 && (
                                <div className="flex flex-wrap gap-4 pt-4">
                                    {review.images.map((img: string, i: number) => (
                                        <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/5 group">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={img} alt="Traveler" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex md:flex-col justify-end gap-3 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8">
                            <button
                                onClick={() => toggleApproval(review.id, review.is_approved)}
                                className={`flex-1 md:flex-none p-4 rounded-2xl transition-all flex items-center justify-center gap-2 font-bold ${review.is_approved
                                    ? "bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20"
                                    : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20"
                                    }`}
                                title={review.is_approved ? "Unapprove Review" : "Approve Review"}
                            >
                                {review.is_approved ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                {review.is_approved ? "Approved" : "Pending"}
                            </button>
                            <button
                                onClick={() => deleteReview(review.id)}
                                className="flex-1 md:flex-none bg-red-500/10 text-red-500 border border-red-500/20 p-4 rounded-2xl hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 font-bold"
                            >
                                <Trash2 className="w-5 h-5" />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {reviews.length === 0 && (
                    <div className="text-gray-500 text-center py-20 bg-slate-900/50 rounded-[2rem] border border-dashed border-white/10">
                        No reviews found. Use the button above to add one!
                    </div>
                )}
            </div>
        </div>
    );
}
