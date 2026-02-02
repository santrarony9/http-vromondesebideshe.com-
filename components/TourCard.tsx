import Link from "next/link";
import { Clock, Users, Star } from "lucide-react";
import Image from "next/image";
import { Tour } from "../types/database";
import { formatCurrency } from "@/lib/utils";

export default function TourCard({ tour }: { tour: Tour }) {
    const whatsappNumber = "916291164753"; // Hardcoded from footer info, ideally from settings
    const whatsappMessage = encodeURIComponent(`Hi, I'm interested in the "${tour.title}" package.`);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    const rating = tour.rating || 5;

    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-xl">
            {/* Image Section */}
            <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                {tour.image_url ? (
                    <Image
                        src={tour.image_url}
                        alt={tour.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                    {tour.category}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 sm:p-5">
                {/* Meta Row */}
                <div className="flex items-center justify-between text-gray-600 text-[11px] mb-3">
                    <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-4 h-4 text-gray-800" />
                        {tour.duration}
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                        <Users className="w-4 h-4 text-gray-800" />
                        Group
                    </div>
                </div>

                {/* Title */}
                <Link href={`/tours/${tour.id}`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {tour.title}
                    </h3>
                </Link>

                <p className="text-[11px] text-gray-500 mb-2">Limited slots • Book now for this week</p>

                {/* Ratings */}
                <div className="flex items-center gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-orange-400 fill-orange-400' : 'text-gray-300'}`}
                        />
                    ))}
                    {rating % 1 !== 0 && (
                        <div className="relative overflow-hidden w-2 h-4">
                            <Star className="absolute left-0 w-4 h-4 text-orange-400 fill-orange-400" />
                        </div>
                    )}
                </div>

                {/* Price and CTA Row */}
                <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">From</span>
                            <span className="text-2xl font-black text-gray-900 leading-none">
                                {formatCurrency(tour.price)}
                            </span>
                        </div>
                        {tour.original_price && (
                            <span className="text-gray-400 line-through text-sm font-medium">
                                {formatCurrency(tour.original_price)}
                            </span>
                        )}
                    </div>

                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#FFC133] hover:bg-[#FFB700] text-gray-900 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
                    >
                        {/* Simple WhatsApp-like SVG */}
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        Whatsapp Now
                    </a>
                </div>
            </div>
        </div>
    );
}
