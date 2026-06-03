-- ============================================================
-- FAC Project - Initial Schema
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text not null,
  phone text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ============================================================
-- TEACHERS
-- ============================================================
create table public.teachers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  bio text,
  specialty text,
  image_url text,
  display_order int default 0,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

alter table public.teachers enable row level security;

create policy "Anyone can view active teachers"
  on public.teachers for select
  using (is_active = true);

create policy "Admins can manage teachers"
  on public.teachers for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ============================================================
-- COURSES
-- ============================================================
create table public.courses (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price numeric(10, 2) not null,
  total_sessions int not null,
  duration_minutes int default 60,
  image_url text,
  teacher_id uuid references public.teachers(id) on delete set null,
  is_active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.courses enable row level security;

create policy "Anyone can view active courses"
  on public.courses for select
  using (is_active = true);

create policy "Admins can manage courses"
  on public.courses for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ============================================================
-- COURSE SCHEDULES (recurring day/time for each course)
-- ============================================================
create table public.course_schedules (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references public.courses(id) on delete cascade not null,
  day_of_week int not null check (day_of_week between 0 and 6), -- 0=Sun, 6=Sat
  start_time time not null,
  end_time time not null
);

alter table public.course_schedules enable row level security;

create policy "Anyone can view course schedules"
  on public.course_schedules for select
  using (true);

create policy "Admins can manage course schedules"
  on public.course_schedules for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ============================================================
-- ENROLLMENTS
-- ============================================================
create table public.enrollments (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references public.profiles(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete restrict not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  sessions_remaining int,
  enrolled_at timestamptz,
  paid_at timestamptz,
  payslip_url text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.enrollments enable row level security;

create policy "Students can view own enrollments"
  on public.enrollments for select
  using (auth.uid() = student_id);

create policy "Students can create enrollment requests"
  on public.enrollments for insert
  with check (auth.uid() = student_id and status = 'pending');

create policy "Admins can manage all enrollments"
  on public.enrollments for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ============================================================
-- SESSIONS (actual class instances)
-- ============================================================
create table public.sessions (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references public.courses(id) on delete cascade not null,
  session_date date not null,
  start_time time not null,
  end_time time not null,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.sessions enable row level security;

create policy "Students can view sessions for their courses"
  on public.sessions for select
  using (
    exists (
      select 1 from public.enrollments e
      where e.student_id = auth.uid()
        and e.course_id = sessions.course_id
        and e.status = 'confirmed'
    )
  );

create policy "Admins can manage sessions"
  on public.sessions for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ============================================================
-- ATTENDANCES
-- ============================================================
create table public.attendances (
  id uuid primary key default uuid_generate_v4(),
  enrollment_id uuid references public.enrollments(id) on delete cascade not null,
  session_id uuid references public.sessions(id) on delete cascade not null,
  attended_at timestamptz not null default now(),
  unique (enrollment_id, session_id)
);

alter table public.attendances enable row level security;

create policy "Students can view own attendance"
  on public.attendances for select
  using (
    exists (
      select 1 from public.enrollments e
      where e.id = attendances.enrollment_id and e.student_id = auth.uid()
    )
  );

create policy "Admins can manage attendances"
  on public.attendances for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ============================================================
-- STUDIO GALLERY
-- ============================================================
create table public.gallery_images (
  id uuid primary key default uuid_generate_v4(),
  image_url text not null,
  caption text,
  display_order int default 0,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

alter table public.gallery_images enable row level security;

create policy "Anyone can view active gallery images"
  on public.gallery_images for select
  using (is_active = true);

create policy "Admins can manage gallery"
  on public.gallery_images for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- TRIGGER: update sessions_remaining after attendance
-- ============================================================
create or replace function public.decrement_sessions_remaining()
returns trigger as $$
begin
  update public.enrollments
  set sessions_remaining = sessions_remaining - 1,
      updated_at = now()
  where id = new.enrollment_id
    and sessions_remaining > 0;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_attendance_created
  after insert on public.attendances
  for each row execute procedure public.decrement_sessions_remaining();

-- ============================================================
-- TRIGGER: restore sessions_remaining on attendance delete
-- ============================================================
create or replace function public.increment_sessions_remaining()
returns trigger as $$
begin
  update public.enrollments
  set sessions_remaining = sessions_remaining + 1,
      updated_at = now()
  where id = old.enrollment_id;
  return old;
end;
$$ language plpgsql security definer;

create trigger on_attendance_deleted
  after delete on public.attendances
  for each row execute procedure public.increment_sessions_remaining();
