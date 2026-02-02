"use client";

import React, { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    disabled?: boolean;
    className?: string;
}

export default function ImageUpload({ value, onChange, disabled, className }: ImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const supabase = createClientComponentClient();

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('images').getPublicUrl(filePath);

            onChange(data.publicUrl);
        } catch (error: any) {
            alert("Error uploading image: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    if (value) {
        return (
            <div className={`relative w-full h-64 bg-slate-800 rounded-lg overflow-hidden border border-white/10 ${className}`}>
                <div className="absolute top-2 right-2 z-10">
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        className="bg-red-500 text-white p-1 rounded-full shadow-sm hover:bg-red-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <Image
                    src={value}
                    alt="Upload"
                    fill
                    className="object-cover"
                />
            </div>
        );
    }

    return (
        <div className={`w-full h-64 bg-slate-800 rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-white/20 hover:text-white transition-colors cursor-pointer relative overflow-hidden ${className}`}>
            <input
                type="file"
                accept="image/*"
                onChange={onUpload}
                disabled={loading || disabled}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            {loading ? (
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <span className="text-sm">Uploading...</span>
                </div>
            ) : (
                <>
                    <div className="p-4 bg-slate-900 rounded-full">
                        <Upload className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                        <p className="font-semibold">Click to upload image</p>
                        <p className="text-sm text-gray-500">SVG, PNG, JPG or GIF</p>
                    </div>
                </>
            )}
        </div>
    );
}
