-- =============================================
-- EcoPantry Database Schema
-- Run this script in Supabase SQL Editor
-- =============================================

-- Enable UUID extension (if not already enabled)
create extension if not exists "uuid-ossp";

-- =============================================
-- 1. PROFILES TABLE
-- =============================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text unique,
  user_type text check (user_type in ('individual', 'family', 'community')),
  household_size integer default 1,
  dietary_preferences text,
  monthly_budget numeric(10,2),
  green_score integer default 0,
  location text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index for faster queries
create index if not exists profiles_user_type_idx on public.profiles(user_type);
create index if not exists profiles_email_idx on public.profiles(email);

-- =============================================
-- 2. INVENTORY TABLE
-- =============================================
create table if not exists public.inventory (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  category text not null,
  quantity numeric(10,2) not null check (quantity >= 0),
  unit text default 'pcs',
  expiry_date date,
  purchase_date date default current_date,
  cost numeric(10,2),
  image_url text,
  batch text,
  purchased_by text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes
create index if not exists inventory_user_id_idx on public.inventory(user_id);
create index if not exists inventory_expiry_date_idx on public.inventory(expiry_date);
create index if not exists inventory_category_idx on public.inventory(category);

-- =============================================
-- 3. CONSUMPTIONS TABLE
-- =============================================
create table if not exists public.consumptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  meal_name text not null,
  meal_date date default current_date,
  ingredients_used jsonb,
  servings integer,
  fed_people integer,
  image_url text,
  wasted_items jsonb,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes
create index if not exists consumptions_user_id_idx on public.consumptions(user_id);
create index if not exists consumptions_meal_date_idx on public.consumptions(meal_date);

-- =============================================
-- 4. RESOURCES TABLE
-- =============================================
create table if not exists public.resources (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null check (category in ('tip', 'recipe', 'article', 'video')),
  content text,
  image_url text,
  ingredients jsonb,
  expiring_ingredients jsonb,
  prep_time text,
  difficulty text check (difficulty in ('Easy', 'Medium', 'Hard')),
  icon text,
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index
create index if not exists resources_category_idx on public.resources(category);
create index if not exists resources_is_public_idx on public.resources(is_public);

-- =============================================
-- 5. ACTIVITY LOGS TABLE
-- =============================================
create table if not exists public.activity_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  activity_type text not null,
  metadata jsonb,
  points_earned integer default 0,
  created_at timestamptz default now()
);

-- Create indexes
create index if not exists activity_logs_user_id_idx on public.activity_logs(user_id);
create index if not exists activity_logs_activity_type_idx on public.activity_logs(activity_type);
create index if not exists activity_logs_created_at_idx on public.activity_logs(created_at);

-- =============================================
-- 6. UPDATED_AT TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for all tables with updated_at
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger set_inventory_updated_at
  before update on public.inventory
  for each row
  execute function public.handle_updated_at();

create trigger set_consumptions_updated_at
  before update on public.consumptions
  for each row
  execute function public.handle_updated_at();

create trigger set_resources_updated_at
  before update on public.resources
  for each row
  execute function public.handle_updated_at();

-- =============================================
-- 7. AUTO-CREATE PROFILE ON USER SIGNUP
-- =============================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, user_type, household_size, monthly_budget)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'user_type', 'individual'),
    coalesce((new.raw_user_meta_data->>'household_size')::integer, 1),
    coalesce((new.raw_user_meta_data->>'monthly_budget')::numeric, null)
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to auto-create profile
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- =============================================
-- SCHEMA CREATION COMPLETE!
-- =============================================
-- Next: Run the RLS policies script
-- =============================================
