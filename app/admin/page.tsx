import { createSafeServerClient } from "@/lib/supabase-server";
import { cookies } from "next/headers";
import Link from "next/link";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import DeleteTourButton from "./components/DeleteTourButton";
import { formatCurrency } from "@/lib/utils";

export const revalidate = 0;

export default async function AdminDashboard() {
    const supabase = createSafeServerClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        redirect("/admin/login");
    }

    const { data: tours } = await supabase
        .from('tours')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-gray-400">Manage your tours and packages</p>
                </div>
                <Link
                    href="/admin/tours/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
                >
                    <Plus className="w-4 h-4" /> Add New Tour
                </Link>
            </div>

            <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-800 text-gray-400">
                        <tr>
                            <th className="p-4">Title</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {tours?.map((tour) => (
                            <tr key={tour.id} className="hover:bg-white/5">
                                <td className="p-4 font-medium">{tour.title}</td>
                                <td className="p-4">{formatCurrency(tour.price)}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${tour.category === 'International' ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'}`}>
                                        {tour.category}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-3">
                                    <Link href={`/admin/tours/${tour.id}/edit`} className="text-blue-400 hover:text-white px-3 py-1 bg-blue-600/20 rounded-md text-sm font-medium">Edit</Link>
                                    <DeleteTourButton tourId={tour.id} />
                                </td>
                            </tr>
                        ))}
                        {tours?.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">No tours found. Add your first one!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
