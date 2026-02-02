-- Create Tours Table
create table tours (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  category text check (category in ('International', 'Domestic')),
  price numeric not null,
  duration text not null,
  image_url text,
  description text,
  itinerary jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Bookings Table
create table bookings (
  id uuid default uuid_generate_v4() primary key,
  tour_id uuid references tours(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  travel_date date not null,
  status text default 'pending' check (status in ('pending', 'confirmed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table tours enable row level security;
alter table bookings enable row level security;

-- Policies (Simple for now: Public read tours, Public insert bookings)
create policy "Public tours are viewable by everyone" on tours for select using (true);
create policy "Admins can insert tours" on tours for insert with check (auth.role() = 'authenticated');
create policy "Admins can update tours" on tours for update using (auth.role() = 'authenticated');
create policy "Admins can delete tours" on tours for delete using (auth.role() = 'authenticated');

create policy "Anyone can create a booking" on bookings for insert with check (true);
create policy "Admins can view bookings" on bookings for select using (auth.role() = 'authenticated');

-- Site Settings Table
create table if not exists site_settings (
  id bigint primary key generated always as identity,
  website_name text default 'Vromon Deshe Bideshe',
  logo_url text,
  address text,
  phone text,
  email text,
  facebook_url text,
  instagram_url text,
  youtube_url text,
  about_title text default 'Our Journey',
  about_description text,
  hero_headline text default 'Explore the Unseen World',
  hero_subheadline text default 'Premium tours, curated itineraries, and unforgettable experiences.',
  hero_image_url text default 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80',
  payment_qr_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table site_settings enable row level security;

-- Policies
create policy "Public read access"
  on site_settings for select
  using ( true );

create policy "Admin update access"
  on site_settings for update
  using ( auth.role() = 'authenticated' );

create policy "Admin insert access"
  on site_settings for insert
  with check ( auth.role() = 'authenticated' );

-- Enquiries Table (Contact Form)
create table if not exists enquiries (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Policies for Enquiries
alter table enquiries enable row level security;
create policy "Anyone can create enquiry" on enquiries for insert with check (true);
create policy "Admins can view enquiries" on enquiries for select using (auth.role() = 'authenticated');

-- Update Bookings Table for Razorpay
alter table bookings add column if not exists payment_id text;
alter table bookings add column if not exists razorpay_order_id text;
alter table bookings add column if not exists payment_status text default 'pending';
alter table bookings add column if not exists amount numeric;

-- Migration: Add extra fields for UI enhancements
alter table tours add column if not exists original_price numeric;
alter table tours add column if not exists rating numeric default 5;
alter table tours add column if not exists add_ons jsonb default '[]'::jsonb;
alter table tours add column if not exists hotels jsonb default '[]'::jsonb;

-- Reviews Table
create table if not exists reviews (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  rating integer not null default 5,
  comment text not null,
  source text default 'google',
  avatar_url text,
  images jsonb default '[]'::jsonb,
  is_approved boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Reviews
alter table reviews enable row level security;
create policy "Anyone can read reviews" on reviews for select using (true);
create policy "Admins can manage reviews" on reviews for all using (auth.role() = 'authenticated');

