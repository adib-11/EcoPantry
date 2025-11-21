-- =============================================
-- EXPIRED ITEMS FEATURE - DATABASE MIGRATION
-- =============================================
-- This script adds functionality to automatically track
-- expired items after they remain expired for 3 days
-- =============================================

-- 1. Add status column to inventory table
ALTER TABLE public.inventory 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' 
CHECK (status IN ('active', 'expired', 'consumed'));

-- Add index for status queries
CREATE INDEX IF NOT EXISTS inventory_status_idx ON public.inventory(status);

-- 2. Add expired_at column to track when item moved to expired
ALTER TABLE public.inventory 
ADD COLUMN IF NOT EXISTS expired_at timestamptz;

-- 3. Create function to automatically mark items as expired after 3 days
CREATE OR REPLACE FUNCTION public.auto_expire_items()
RETURNS void AS $$
BEGIN
  -- Update items to expired status if:
  -- 1. They have an expiry_date
  -- 2. Expiry date is more than 3 days ago
  -- 3. Status is still 'active'
  UPDATE public.inventory
  SET 
    status = 'expired',
    expired_at = NOW()
  WHERE 
    status = 'active'
    AND expiry_date IS NOT NULL
    AND expiry_date < (CURRENT_DATE - INTERVAL '3 days')
    AND expired_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create a scheduled job using pg_cron (if available)
-- Note: pg_cron needs to be enabled in Supabase
-- This runs daily at midnight to check for expired items
-- If pg_cron is not available, this can be called from the application

-- Uncomment if pg_cron is enabled:
-- SELECT cron.schedule(
--   'auto-expire-items-daily',
--   '0 0 * * *',  -- Run at midnight every day
--   $$ SELECT public.auto_expire_items(); $$
-- );

-- 5. Create a view for expired items (for easy querying)
CREATE OR REPLACE VIEW public.expired_items AS
SELECT 
  i.id,
  i.user_id,
  i.name,
  i.category,
  i.quantity,
  i.unit,
  i.expiry_date,
  i.expired_at,
  i.cost,
  i.image_url,
  i.notes,
  EXTRACT(DAY FROM (CURRENT_DATE - i.expiry_date)) AS days_expired,
  i.created_at
FROM 
  public.inventory i
WHERE 
  i.status = 'expired'
ORDER BY 
  i.expired_at DESC;

-- 6. Create function to get expired items count for a user
CREATE OR REPLACE FUNCTION public.get_expired_items_count(p_user_id uuid)
RETURNS integer AS $$
DECLARE
  item_count integer;
BEGIN
  SELECT COUNT(*)
  INTO item_count
  FROM public.inventory
  WHERE user_id = p_user_id
    AND status = 'expired';
  
  RETURN item_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create function to get user's expired items
CREATE OR REPLACE FUNCTION public.get_user_expired_items(p_user_id uuid)
RETURNS TABLE (
  id uuid,
  name text,
  category text,
  quantity numeric,
  unit text,
  expiry_date date,
  expired_at timestamptz,
  cost numeric,
  image_url text,
  notes text,
  days_expired numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.name,
    i.category,
    i.quantity,
    i.unit,
    i.expiry_date,
    i.expired_at,
    i.cost,
    i.image_url,
    i.notes,
    EXTRACT(DAY FROM (CURRENT_DATE - i.expiry_date)) AS days_expired
  FROM 
    public.inventory i
  WHERE 
    i.user_id = p_user_id
    AND i.status = 'expired'
  ORDER BY 
    i.expired_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create trigger to auto-check expiry on inventory insert/update
CREATE OR REPLACE FUNCTION public.check_expiry_on_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If item has an expiry date and it's more than 3 days past
  IF NEW.expiry_date IS NOT NULL 
     AND NEW.expiry_date < (CURRENT_DATE - INTERVAL '3 days')
     AND NEW.status = 'active' THEN
    NEW.status := 'expired';
    NEW.expired_at := NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS check_expiry_trigger ON public.inventory;
CREATE TRIGGER check_expiry_trigger
  BEFORE INSERT OR UPDATE ON public.inventory
  FOR EACH ROW
  EXECUTE FUNCTION public.check_expiry_on_change();

-- 9. Update RLS policies to include expired items
-- Users can view their own expired items
DROP POLICY IF EXISTS "Users can view own expired items" ON public.inventory;
CREATE POLICY "Users can view own expired items"
  ON public.inventory FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own inventory items
DROP POLICY IF EXISTS "Users can update own inventory" ON public.inventory;
CREATE POLICY "Users can update own inventory"
  ON public.inventory FOR UPDATE
  USING (auth.uid() = user_id);

-- 10. Create function to mark expired items as consumed or deleted
CREATE OR REPLACE FUNCTION public.handle_expired_item(
  p_item_id uuid,
  p_action text  -- 'delete' or 'consume'
)
RETURNS boolean AS $$
BEGIN
  IF p_action = 'delete' THEN
    -- Soft delete by keeping record but removing from active view
    UPDATE public.inventory
    SET status = 'consumed'  -- or create a 'deleted' status
    WHERE id = p_item_id;
    RETURN true;
  ELSIF p_action = 'consume' THEN
    UPDATE public.inventory
    SET status = 'consumed'
    WHERE id = p_item_id;
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- MIGRATION COMPLETE!
-- =============================================
-- To manually trigger expiry check, run:
-- SELECT public.auto_expire_items();
-- =============================================

-- Run the auto-expire function once to mark existing items
SELECT public.auto_expire_items();

