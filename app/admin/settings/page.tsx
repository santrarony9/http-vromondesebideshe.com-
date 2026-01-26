import { createSafeServerClient } from "@/lib/supabase-server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SettingsForm from "../components/SettingsForm";

export const revalidate = 0;

export default async function SettingsPage() {
    const supabase = createSafeServerClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        redirect("/admin/login");
    }

    // Fetch existing settings (ID 1)
    const { data: settings } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single();

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Site Settings</h1>
            <p className="text-gray-400 mb-8">Manage your website's contact info, social links, and branding.</p>

            <SettingsForm initialData={settings || {}} />
        </div>
    );
}
