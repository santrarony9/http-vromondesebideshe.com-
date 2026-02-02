// This file is manually created to define the shape of our data
// In a real workflow, we would generate this from the database using the Supabase CLI

export type Tour = {
    id: string;
    title: string;
    slug: string;
    category: 'International' | 'Domestic';
    price: number;
    duration: string;
    image_url: string;
    description: string;
    original_price?: number;
    rating?: number;
    itinerary?: any[]; // Array of { day, title, description, image }
    add_ons?: any[];   // Array of { name, price }
    hotels?: any[];    // Array of { name, image_url, description }
    created_at: string;
}

export type Review = {
    id: string;
    name: string;
    rating: number;
    comment: string;
    source: string;
    avatar_url?: string;
    images?: string[]; // Array of image URLs
    is_approved: boolean;
    created_at: string;
}

export type Booking = {
    id: string;
    tour_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    travel_date: string;
    status: 'pending' | 'confirmed';
    created_at: string;
}
