-- Enable pg_cron extension (run this in Supabase SQL editor)
-- Note: pg_cron must be enabled from Supabase Dashboard > Database > Extensions

-- Schedule the course-expiry-reminder Edge Function to run every day at 9:00 AM Bangkok time (UTC+7 = 02:00 UTC)
select cron.schedule(
  'course-expiry-reminder',
  '0 2 * * *',  -- Every day at 02:00 UTC = 09:00 Bangkok
  $$
  select net.http_post(
    url := 'https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/course-expiry-reminder',
    headers := '{"Authorization": "Bearer <YOUR_ANON_KEY>", "Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  )
  $$
);
