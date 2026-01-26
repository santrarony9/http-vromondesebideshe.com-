import { createSafeServerClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const supabase = createSafeServerClient();
    const { data: post } = await supabase.from('posts').select('*').eq('slug', params.slug).single();

    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.title} | Vromon Blog`,
        description: post.content.substring(0, 160),
    };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const supabase = createSafeServerClient();
    const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', params.slug)
        .eq('is_published', true)
        .single();

    if (!post) return notFound();

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-20">
            <article className="container mx-auto px-4 max-w-4xl">
                <Link href="/blog" className="inline-flex items-center text-gray-400 hover:text-blue-400 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    {post.title}
                </h1>

                <div className="flex items-center gap-4 text-gray-400 mb-8 pb-8 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.created_at).toLocaleDateString()}
                    </div>
                    <span>•</span>
                    <span>By Vromon Team</span>
                </div>

                {post.image_url && (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 border border-white/5">
                        <Image
                            src={post.image_url}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-blue-400 hover:prose-a:text-blue-300">
                    {/* Simple text rendering for now, can upgrade to markdown parser later if needed */}
                    <div className="whitespace-pre-wrap font-serif text-gray-300 leading-relaxed">
                        {post.content}
                    </div>
                </div>
            </article>
        </div>
    );
}
