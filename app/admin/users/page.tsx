"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Trash2, UserPlus, Loader2, AlertCircle } from "lucide-react";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newEmail, setNewEmail] = useState("");
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState("");
    const supabase = createClientComponentClient();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('admin_users')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setUsers(data);
        }
        setLoading(false);
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail) return;

        setAdding(true);
        setError("");

        try {
            const { error } = await supabase
                .from('admin_users')
                .insert([{ email: newEmail }]);

            if (error) throw error;

            setNewEmail("");
            fetchUsers();
            alert("User added! They can now log in.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteUser = async (id: string, email: string) => {
        if (!confirm(`Are you sure you want to remove ${email}? They will lose access immediately.`)) return;

        const { error } = await supabase
            .from('admin_users')
            .delete()
            .eq('id', id);

        if (error) {
            alert("Error deleting user: " + error.message);
        } else {
            fetchUsers();
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Manage Admin Users</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="md:col-span-1">
                    <div className="bg-slate-900 border border-white/10 p-6 rounded-xl">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-blue-400" />
                            Add New Admin
                        </h2>
                        <p className="text-gray-400 text-sm mb-6">
                            Enter the email address of the person you want to grant admin access to.
                        </p>

                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-400">Email Address</label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="partner@example.com"
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={adding || !newEmail}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 rounded-lg transition-colors flex justify-center"
                            >
                                {adding ? <Loader2 className="animate-spin" /> : "Authorize User"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="md:col-span-2">
                    <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-xl font-semibold">Authorized Users</h2>
                        </div>

                        {loading ? (
                            <div className="p-12 flex justify-center text-gray-500">
                                <Loader2 className="animate-spin w-8 h-8" />
                            </div>
                        ) : users.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                No users found. (You should add yourself first!)
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-slate-800 text-gray-400">
                                    <tr>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Added On</th>
                                        <th className="p-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/5">
                                            <td className="p-4 font-medium">{user.email}</td>
                                            <td className="p-4 text-gray-400 text-sm">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteUser(user.id, user.email)}
                                                    className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Revoke Access"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
