-- ============================================================
-- Fix RLS infinite recursion on profiles table
-- ============================================================

-- 1. สร้าง helper function ที่ bypass RLS ได้ (security definer)
create or replace function public.get_my_role()
returns text
language sql
security definer
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

-- 2. Drop policies ที่ recursive ออกทั้งหมด
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Admins can manage teachers" on public.teachers;
drop policy if exists "Admins can manage courses" on public.courses;
drop policy if exists "Admins can manage course schedules" on public.course_schedules;
drop policy if exists "Admins can manage all enrollments" on public.enrollments;
drop policy if exists "Admins can manage sessions" on public.sessions;
drop policy if exists "Admins can manage attendances" on public.attendances;
drop policy if exists "Admins can manage gallery" on public.gallery_images;

-- 3. สร้าง policies ใหม่โดยใช้ get_my_role() แทน
create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.get_my_role() = 'admin');

create policy "Admins can manage teachers"
  on public.teachers for all
  using (public.get_my_role() = 'admin');

create policy "Admins can manage courses"
  on public.courses for all
  using (public.get_my_role() = 'admin');

create policy "Admins can manage course schedules"
  on public.course_schedules for all
  using (public.get_my_role() = 'admin');

create policy "Admins can manage all enrollments"
  on public.enrollments for all
  using (public.get_my_role() = 'admin');

create policy "Admins can manage sessions"
  on public.sessions for all
  using (public.get_my_role() = 'admin');

create policy "Admins can manage attendances"
  on public.attendances for all
  using (public.get_my_role() = 'admin');

create policy "Admins can manage gallery"
  on public.gallery_images for all
  using (public.get_my_role() = 'admin');
