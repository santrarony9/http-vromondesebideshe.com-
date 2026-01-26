import { createSafeServerClient } from "@/lib/supabase-server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { format } from "date-fns";

export const revalidate = 0;

export default async function EnquiriesPage() {
    const supabase = createSafeServerClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        redirect("/admin/login");
    }

    const { data: enquiries } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Customer Enquiries</h1>

            <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-800 text-gray-400">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Contact</th>
                            <th className="p-4">Message</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {enquiries?.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5">
                                <td className="p-4 text-sm text-gray-400">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4 font-medium">{item.name}</td>
                                <td className="p-4 text-sm">
                                    <div className="text-white">{item.email}</div>
                                    <div className="text-gray-500">{item.phone}</div>
                                </td>
                                <td className="p-4 text-gray-300 max-w-md truncate">
                                    {item.message}
                                </td>
                            </tr>
                        ))}
                        {enquiries?.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">No enquiries found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
