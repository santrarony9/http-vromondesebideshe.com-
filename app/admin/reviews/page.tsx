"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2, Trash2, CheckCircle, XCircle, Plus, X } from "lucide-react";
import Image from "next/image";

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
            setNewReview({ name: "", rating: 5, comment: "", source: "google", avatar_url: "", is_approved: true });
            fetchReviews();
        } else {
            alert("Error creating review: " + error.message);
        }
    };

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Customer Reviews</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showForm ? "Cancel" : "Add Google Review"}
                </button>
            </div>

            {showForm && (
                <div className="bg-slate-900 border border-white/10 p-6 rounded-xl mb-8 animate-fade-in-down">
                    <h2 className="text-xl font-bold mb-4">Add Manual Review</h2>
                    <form onSubmit={handleCreateReview} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-800 border-white/10 rounded-lg px-4 py-2"
                                    value={newReview.name}
                                    onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Rating</label>
                                <select
                                    className="w-full bg-slate-800 border-white/10 rounded-lg px-4 py-2"
                                    value={newReview.rating}
                                    onChange={e => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                                >
                                    {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Source</label>
                                <select
                                    className="w-full bg-slate-800 border-white/10 rounded-lg px-4 py-2"
                                    value={newReview.source}
                                    onChange={e => setNewReview({ ...newReview, source: e.target.value })}
                                >
                                    <option value="google">Google</option>
                                    <option value="website">Website</option>
                                    <option value="facebook">Facebook</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Avatar URL (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-800 border-white/10 rounded-lg px-4 py-2"
                                    placeholder="https://lh3.googleusercontent.com/..."
                                    value={newReview.avatar_url}
                                    onChange={e => setNewReview({ ...newReview, avatar_url: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Comment</label>
                            <textarea
                                required
                                className="w-full bg-slate-800 border-white/10 rounded-lg px-4 py-2 h-24"
                                value={newReview.comment}
                                onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold">
                            Save Review
                        </button>
                    </form>
                </div>
            )}

            <div className="grid gap-6">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-slate-900 border border-white/10 p-6 rounded-xl flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                                {review.avatar_url && (
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                        <Image src={review.avatar_url} alt={review.name} fill className="object-cover" />
                                    </div>
                                )}
                                <h3 className="font-bold text-lg">{review.name}</h3>
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                                    ))}
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full uppercase ${review.source === 'google' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                    {review.source}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${review.is_approved ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                    {review.is_approved ? 'Approved' : 'Pending'}
                                </span>
                            </div>
                            <p className="text-gray-400">{review.comment}</p>
                            <p className="text-xs text-gray-500 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => toggleApproval(review.id, review.is_approved)}
                                className={`p-2 rounded-lg transition-colors ${review.is_approved ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}`}
                                title={review.is_approved ? "Unapprove" : "Approve"}
                            >
                                {review.is_approved ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={() => deleteReview(review.id)}
                                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}

                {reviews.length === 0 && (
                    <div className="text-gray-500 text-center py-12">No reviews found.</div>
                )}
            </div>
        </div>
    );
}
