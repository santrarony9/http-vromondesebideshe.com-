"use client";

import PostForm from "../components/PostForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewPostPage() {
    return (
        <div className="p-8">
            <Link href="/admin/blog" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
            </Link>
            <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
            <PostForm />
        </div>
    );
}
