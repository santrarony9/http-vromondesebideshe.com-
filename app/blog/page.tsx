import { createSafeServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User } from "lucide-react";

export const revalidate = 0;

export default async function BlogPage() {
    const supabase = createSafeServerClient();
    const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4">
                        Travel Stories & Tips
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Explore our latest articles, guides, and travel inspiration.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {posts?.map((post) => (
                        <Link href={`/blog/${post.slug}`} key={post.id} className="group bg-slate-900 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300">
                            {post.image_url ? (
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={post.image_url}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            ) : (
                                <div className="h-48 bg-slate-800 flex items-center justify-center text-gray-500">
                                    No Image
                                </div>
                            )}
                            <div className="p-6">
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        Admin
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                                    {post.title}
                                </h2>
                                <p className="text-gray-400 text-sm line-clamp-3">
                                    {post.content}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
