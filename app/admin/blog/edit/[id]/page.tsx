"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import PostForm from "../../components/PostForm";

export default function EditPostPage({ params }: { params: { id: string } }) {
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchPost = async () => {
            const { data } = await supabase
                .from('posts')
                .select('*')
                .eq('id', params.id)
                .single();

            if (data) setPost(data);
            setLoading(false);
        };
        fetchPost();
    }, [params.id]);

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;
    if (!post) return <div className="p-8">Post not found</div>;

    return (
        <div className="p-8">
            <Link href="/admin/blog" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
            </Link>
            <h1 className="text-3xl font-bold mb-8">Edit Post: {post.title}</h1>
            <PostForm initialData={post} isEdit />
        </div>
    );
}
