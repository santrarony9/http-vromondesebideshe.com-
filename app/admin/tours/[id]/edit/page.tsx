"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import TourForm from "../../../components/TourForm";
import { useRouter } from "next/navigation";

export default function EditTourPage({ params }: { params: { id: string } }) {
    const [tour, setTour] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClientComponentClient();
    const router = useRouter();

    useEffect(() => {
        const fetchTour = async () => {
            const { data, error } = await supabase
                .from('tours')
                .select('*')
                .eq('id', params.id)
                .single();

            if (error || !data) {
                // Handle not found
                alert("Tour not found");
                router.push("/admin");
                return;
            }

            setTour(data);
            setLoading(false);
        };
        fetchTour();
    }, [params.id, router]);

    if (loading) return <div className="min-h-screen pt-24 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-3xl mx-auto">
            <Link href="/admin" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold mb-8">Edit Package: {tour.title}</h1>
            <TourForm initialData={tour} isEdit />
        </div>
    );
}
