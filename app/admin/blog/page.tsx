"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminBlog() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClientComponentClient();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setPosts(data);
        setLoading(false);
    };

    const deletePost = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (!error) fetchPosts();
    };

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Blog Posts</h1>
                <Link href="/admin/blog/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" />
                    New Post
                </Link>
            </div>

            <div className="grid gap-6">
                {posts.map((post) => (
                    <div key={post.id} className="bg-slate-900 border border-white/10 p-6 rounded-xl flex flex-col md:flex-row gap-6">
                        {post.image_url && (
                            <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0">
                                <Image
                                    src={post.image_url}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-xl text-white">{post.title}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${post.is_published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                    {post.is_published ? 'Published' : 'Draft'}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm line-clamp-2 mb-4">{post.content}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</span>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin/blog/edit/${post.id}`}
                                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-blue-400 transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => deletePost(post.id)}
                                        className="p-2 bg-slate-800 hover:bg-red-900/50 rounded-lg text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {posts.length === 0 && (
                    <div className="text-gray-500 text-center py-12">No posts found. Create your first blog post!</div>
                )}
            </div>
        </div>
    );
}
