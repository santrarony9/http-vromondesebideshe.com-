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
    itinerary: any; // JSONB
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
