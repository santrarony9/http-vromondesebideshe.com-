import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { Tour } from "../types/database";
import { formatCurrency } from "@/lib/utils";

export default function TourCard({ tour }: { tour: Tour }) {
    return (
        <div className="group bg-slate-900 rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
            <div className="aspect-[4/3] bg-slate-800 relative overflow-hidden">
                {tour.image_url ? (
                    <Image
                        src={tour.image_url}
                        alt={tour.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-gray-500">
                        No Image
                    </div>
                )}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                    {tour.category}
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{tour.title}</h3>

                <div className="flex items-center text-gray-400 text-sm mb-4 space-x-4">
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-blue-500" />
                        {tour.duration}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <div>
                        <span className="text-sm text-gray-400">Starts from</span>
                        <div className="text-2xl font-bold text-white">{formatCurrency(tour.price)}</div>
                    </div>
                    <Link
                        href={`/tours/${tour.id}`}
                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
