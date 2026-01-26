-- Reviews Table
create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  source text default 'website', -- 'website' or 'google'
  avatar_url text, -- for google profile picture
  is_approved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Blog Posts Table
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  content text not null,
  image_url text,
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table reviews enable row level security;
alter table posts enable row level security;

-- Admin Users Whitelist
create table if not exists admin_users (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for admin_users
alter table admin_users enable row level security;

-- Only already whitelisted admins can view/manage the whitelist
-- (Bootstrap problem: We need to manually insert the first admin via SQL Editor)
create policy "Admins can view admin_users"
  on admin_users for select
  using ( auth.email() in (select email from admin_users) );

create policy "Admins can insert admin_users"
  on admin_users for insert
  with check ( auth.email() in (select email from admin_users) );

create policy "Admins can delete admin_users"
  on admin_users for delete
  using ( auth.email() in (select email from admin_users) );


-- REVIEWS Table Policies (Updated to check whitelist)
drop policy if exists "Public reviews are viewable by everyone" on reviews;
create policy "Public reviews are viewable by everyone"
  on reviews for select
  using ( is_approved = true );

drop policy if exists "Admins can view all reviews" on reviews;
create policy "Admins can view all reviews"
  on reviews for select
  using ( auth.email() in (select email from admin_users) );

drop policy if exists "Admins can insert/update/delete reviews" on reviews;
create policy "Admins can insert/update/delete reviews"
  on reviews for all
  using ( auth.email() in (select email from admin_users) ); 

-- POSTS Table Policies (Updated to check whitelist)
drop policy if exists "Public posts are viewable by everyone" on posts;
create policy "Public posts are viewable by everyone"
  on posts for select
  using ( is_published = true );

drop policy if exists "Admins can manage posts" on posts;
create policy "Admins can manage posts"
  on posts for all
  using ( auth.email() in (select email from admin_users) );

-- SITE SETTINGS Policies
-- Assuming site_settings table exists (not shown in previous context but implied)
-- We should ensure RLS is enabled there too if possible, but for now we focus on the requested features

