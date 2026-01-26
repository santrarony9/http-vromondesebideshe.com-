"use client";

import { Trash2 } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteTourButton({ tourId }: { tourId: string }) {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this tour? This cannot be undone.");
        if (!confirmed) return;

        setIsDeleting(true);

        try {
            const { error } = await supabase
                .from('tours')
                .delete()
                .eq('id', tourId);

            if (error) {
                alert("Error deleting tour: " + error.message);
                return;
            }

            // Refresh the page data
            router.refresh();
            alert("Tour deleted successfully!");
        } catch (err) {
            console.error("Error:", err);
            alert("Something went wrong.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
            title="Delete Tour"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}
