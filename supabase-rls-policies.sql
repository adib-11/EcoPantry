-- =============================================
-- EcoPantry Row Level Security (RLS) Policies
-- Run this AFTER creating the schema
-- =============================================

-- =============================================
-- 1. PROFILES TABLE POLICIES
-- =============================================

-- Enable RLS
alter table public.profiles enable row level security;

-- Users can view their own profile
create policy "Users can view own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Users can insert their own profile (handled by trigger, but adding for completeness)
create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- =============================================
-- 2. INVENTORY TABLE POLICIES
-- =============================================

-- Enable RLS
alter table public.inventory enable row level security;

-- Users can view their own inventory
create policy "Users can view own inventory"
  on public.inventory
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can insert their own inventory items
create policy "Users can insert own inventory"
  on public.inventory
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can update their own inventory items
create policy "Users can update own inventory"
  on public.inventory
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can delete their own inventory items
create policy "Users can delete own inventory"
  on public.inventory
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- =============================================
-- 3. CONSUMPTIONS TABLE POLICIES
-- =============================================

-- Enable RLS
alter table public.consumptions enable row level security;

-- Users can view their own consumption logs
create policy "Users can view own consumptions"
  on public.consumptions
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can insert their own consumption logs
create policy "Users can insert own consumptions"
  on public.consumptions
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can update their own consumption logs
create policy "Users can update own consumptions"
  on public.consumptions
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can delete their own consumption logs
create policy "Users can delete own consumptions"
  on public.consumptions
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- =============================================
-- 4. RESOURCES TABLE POLICIES
-- =============================================

-- Enable RLS
alter table public.resources enable row level security;

-- Anyone authenticated can view public resources
create policy "Authenticated users can view public resources"
  on public.resources
  for select
  to authenticated
  using (is_public = true);

-- For now, resources are read-only for users
-- Future: Add admin role for resource management

-- =============================================
-- 5. ACTIVITY LOGS TABLE POLICIES
-- =============================================

-- Enable RLS
alter table public.activity_logs enable row level security;

-- Users can view their own activity logs
create policy "Users can view own activity logs"
  on public.activity_logs
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can insert their own activity logs
create policy "Users can insert own activity logs"
  on public.activity_logs
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES COMPLETE!
-- =============================================
-- All tables are now secured with Row Level Security
-- Users can only access their own data
-- =============================================
