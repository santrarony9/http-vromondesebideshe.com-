import { createSafeServerClient } from "@/lib/supabase-server";

export const revalidate = 0;

export default async function DebugPage() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "undefined";
    const status = url.includes("placeholder") ? "❌ Using Placeholder (Env Vars Missing)" : "✅ Connected to Live Supabase";

    // Try to fetch to see if it actually works
    const supabase = createSafeServerClient();
    const { data, error } = await supabase.from('site_settings').select('count(*)').single();
    const dbStatus = error ? `❌ Database Connection Failed: ${error.message}` : "✅ Database Connection OK";

    return (
        <div className="min-h-screen bg-black text-white p-12 font-mono">
            <h1 className="text-2xl font-bold mb-4">Connection Debugger</h1>

            <div className="space-y-4 border border-white/20 p-6 rounded-lg">
                <div>
                    <label className="text-gray-500">Supabase URL Status:</label>
                    <div className="text-xl">{status}</div>
                    <div className="text-xs text-gray-600 mt-1">Value detected: {url.substring(0, 15)}...</div>
                </div>

                <div className="pt-4 border-t border-white/10">
                    <label className="text-gray-500">Real Database Test:</label>
                    <div className="text-xl">{dbStatus}</div>
                </div>
            </div>

            <p className="mt-8 text-gray-400 max-w-md">
                If you see ❌ above, you need to go to Vercel Settings -&gt; Environment Variables and ensure
                `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct and you have REDEPLOYED.
            </p>
        </div>
    );
}
