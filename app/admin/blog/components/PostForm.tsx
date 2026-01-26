"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PostFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function PostForm({ initialData, isEdit = false }: PostFormProps) {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        content: initialData?.content || "",
        image_url: initialData?.image_url || "",
        is_published: initialData?.is_published || false
    });

    // Auto-generate slug from title if creating new
    useEffect(() => {
        if (!isEdit && formData.title && !formData.slug) {
            setFormData(prev => ({
                ...prev,
                slug: prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }));
        }
    }, [formData.title, isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggle = () => {
        setFormData(prev => ({ ...prev, is_published: !prev.is_published }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEdit) {
                const { error } = await supabase
                    .from('posts')
                    .update({ ...formData, updated_at: new Date().toISOString() })
                    .eq('id', initialData.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('posts')
                    .insert([formData]);
                if (error) throw error;
            }

            router.push('/admin/blog');
            router.refresh();
        } catch (error: any) {
            alert("Error saving post: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-white/10 space-y-6">
                <div className="grid gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">Post Title</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">Slug (URL)</label>
                        <input
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm text-gray-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">Cover Image URL</label>
                        <input
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            rows={15}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white font-mono"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleToggle}
                            className={`w-12 h-6 rounded-full transition-colors relative ${formData.is_published ? 'bg-green-600' : 'bg-slate-700'}`}
                        >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.is_published ? 'left-7' : 'left-1'}`} />
                        </button>
                        <span className="text-gray-300">{formData.is_published ? 'Published' : 'Draft (Hidden)'}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Link href="/admin/blog" className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-gray-300">
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isEdit ? 'Update Post' : 'Create Post'}
                </button>
            </div>
        </form>
    );
}
