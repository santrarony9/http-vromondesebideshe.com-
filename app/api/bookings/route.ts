
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
    );

    try {
        const body = await request.json();
        const { data, error } = await supabase
            .from('bookings')
            .insert([
                {
                    tour_id: body.tour_id,
                    customer_name: body.customer_name,
                    customer_email: body.customer_email,
                    customer_phone: body.customer_phone,
                    travel_date: body.travel_date,
                    // payment_id: body.payment_id,  <-- Removed
                    // razorpay_order_id: body.razorpay_order_id, <-- Removed
                    payment_status: body.payment_status || 'pending',
                    amount: body.amount,
                },
            ]);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error creating booking' }, { status: 500 });
    }
}
