-- =============================================
-- EcoPantry Storage Buckets Setup
-- Run this in Supabase SQL Editor
-- =============================================

-- First, create the buckets (if not created via UI)
-- Note: You may need to create buckets via UI first, then run policies

-- =============================================
-- STORAGE POLICIES
-- =============================================

-- =============================================
-- 1. PANTRY-IMAGES BUCKET POLICIES
-- =============================================

create policy "Users can upload own pantry images"
on storage.objects for insert 
to authenticated
with check (
  bucket_id = 'pantry-images' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Anyone can view pantry images"
on storage.objects for select 
to public
using (bucket_id = 'pantry-images');

create policy "Users can update own pantry images"
on storage.objects for update 
to authenticated
using (
  bucket_id = 'pantry-images' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete own pantry images"
on storage.objects for delete 
to authenticated
using (
  bucket_id = 'pantry-images' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- =============================================
-- 2. MEAL-IMAGES BUCKET POLICIES
-- =============================================

create policy "Users can upload own meal images"
on storage.objects for insert 
to authenticated
with check (
  bucket_id = 'meal-images' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Anyone can view meal images"
on storage.objects for select 
to public
using (bucket_id = 'meal-images');

create policy "Users can update own meal images"
on storage.objects for update 
to authenticated
using (
  bucket_id = 'meal-images' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete own meal images"
on storage.objects for delete 
to authenticated
using (
  bucket_id = 'meal-images' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- =============================================
-- 3. RECEIPTS BUCKET POLICIES
-- =============================================

create policy "Users can upload own receipts"
on storage.objects for insert 
to authenticated
with check (
  bucket_id = 'receipts' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Anyone can view receipts"
on storage.objects for select 
to public
using (bucket_id = 'receipts');

create policy "Users can update own receipts"
on storage.objects for update 
to authenticated
using (
  bucket_id = 'receipts' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete own receipts"
on storage.objects for delete 
to authenticated
using (
  bucket_id = 'receipts' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- =============================================
-- 4. AVATARS BUCKET POLICIES
-- =============================================

create policy "Users can upload own avatars"
on storage.objects for insert 
to authenticated
with check (
  bucket_id = 'avatars' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Anyone can view avatars"
on storage.objects for select 
to public
using (bucket_id = 'avatars');

create policy "Users can update own avatars"
on storage.objects for update 
to authenticated
using (
  bucket_id = 'avatars' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete own avatars"
on storage.objects for delete 
to authenticated
using (
  bucket_id = 'avatars' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- =============================================
-- STORAGE POLICIES COMPLETE!
-- =============================================
-- Note: Make sure to create the buckets via UI first:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create these 4 PUBLIC buckets:
--    - pantry-images
--    - meal-images
--    - receipts
--    - avatars
-- 3. Then run this SQL script
-- =============================================
