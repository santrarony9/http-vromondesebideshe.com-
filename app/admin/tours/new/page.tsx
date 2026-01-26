"use client";

import TourForm from "../../components/TourForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddTour() {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-3xl mx-auto">
            <Link href="/admin" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold mb-8">Add New Package</h1>
            <TourForm />
        </div>
    );
}
