-- ============================================================
-- FAC Seed Data — Teachers & Courses
-- ============================================================

-- Teachers
insert into public.teachers (name, specialty, bio, display_order, is_active)
values
  (
    'ครูฝ้าย',
    'วาดเส้น, สีน้ำ, Portrait',
    'ศิลปินและครูสอนศิลปะที่มีประสบการณ์กว่า 8 ปี จบการศึกษาจากคณะจิตรกรรมฯ มหาวิทยาลัยศิลปากร เชี่ยวชาญด้านการวาดเส้นและสีน้ำ เน้นให้นักเรียนเข้าใจพื้นฐานอย่างถ่องแท้ก่อนพัฒนาสไตล์ของตัวเอง',
    1,
    true
  ),
  (
    'ครูแก้ม',
    'Digital Art, Graphic Design, Illustration',
    'นักออกแบบกราฟิกและ Illustrator มืออาชีพ ประสบการณ์ทำงานใน Agency ชั้นนำกว่า 6 ปี เชี่ยวชาญด้าน Procreate, Adobe Illustrator และ Photoshop มีสไตล์การสอนที่เน้น Workflow จริงในอุตสาหกรรม',
    2,
    true
  );

-- Courses
insert into public.courses (name, description, price, total_sessions, duration_minutes, teacher_id, is_active)
values
  (
    'วาดเส้น & สเก็ตช์',
    'เรียนรู้พื้นฐานการวาดเส้นตั้งแต่ศูนย์ ครอบคลุมทั้ง สัดส่วน, มุมมอง, แสง-เงา และการจับดินสอที่ถูกต้อง เหมาะสำหรับผู้เริ่มต้นที่ไม่มีพื้นฐานมาก่อน',
    2500,
    10,
    90,
    (select id from public.teachers where name = 'ครูฝ้าย'),
    true
  ),
  (
    'สีน้ำ — Beginner',
    'ทำความรู้จักกับสีน้ำตั้งแต่การเลือกอุปกรณ์ไปจนถึงเทคนิค wet-on-wet, wet-on-dry, gradient และ texture เน้นสนุกกับกระบวนการมากกว่าผลลัพธ์ที่สมบูรณ์แบบ',
    2800,
    10,
    90,
    (select id from public.teachers where name = 'ครูฝ้าย'),
    true
  ),
  (
    'Portrait & Figure Drawing',
    'เจาะลึกการวาดใบหน้าและร่างกายมนุษย์ ครอบคลุมสัดส่วนใบหน้า, การแสดงอารมณ์, Anatomy เบื้องต้น และการจับท่าทาง เหมาะสำหรับผู้ที่มีพื้นฐานการวาดเส้นแล้ว',
    3200,
    12,
    90,
    (select id from public.teachers where name = 'ครูฝ้าย'),
    true
  ),
  (
    'Digital Art — Procreate',
    'เรียนรู้การวาดภาพดิจิทัลด้วย Procreate บน iPad ตั้งแต่ interface, brush settings, layer management ไปจนถึงการสร้าง Illustration สไตล์ของตัวเองได้',
    3500,
    10,
    90,
    (select id from public.teachers where name = 'ครูแก้ม'),
    true
  ),
  (
    'Graphic Design พื้นฐาน',
    'เรียนรู้หลักการออกแบบกราฟิกที่ใช้งานจริง ทั้ง Typography, Color Theory, Layout และการใช้ Adobe Illustrator เพื่อสร้างงาน Logo, Poster และ Social Media Content',
    3800,
    12,
    90,
    (select id from public.teachers where name = 'ครูแก้ม'),
    true
  );

-- Course Schedules
-- วาดเส้น & สเก็ตช์ — เสาร์ 10:00-11:30, อาทิตย์ 13:00-14:30
insert into public.course_schedules (course_id, day_of_week, start_time, end_time)
select id, 6, '10:00', '11:30' from public.courses where name = 'วาดเส้น & สเก็ตช์';

insert into public.course_schedules (course_id, day_of_week, start_time, end_time)
select id, 0, '13:00', '14:30' from public.courses where name = 'วาดเส้น & สเก็ตช์';

-- สีน้ำ — อังคาร 17:00-18:30, พฤหัสบดี 17:00-18:30
insert into public.course_schedules (course_id, day_of_week, start_time, end_time)
select id, 2, '17:00', '18:30' from public.courses where name = 'สีน้ำ — Beginner';

insert into public.course_schedules (course_id, day_of_week, start_time, end_time)
select id, 4, '17:00', '18:30' from public.courses where name = 'สีน้ำ — Beginner';

-- Portrait — เสาร์ 13:00-14:30
insert into public.course_schedules (course_id, day_of_week, start_time, end_time)
select id, 6, '13:00', '14:30' from public.courses where name = 'Portrait & Figure Drawing';

-- Digital Art Procreate — จันทร์ 18:00-19:30, พุธ 18:00-19:30
insert into public.course_schedules (course_id, day_of_week, start_time, end_time)
select id, 1, '18:00', '19:30' from public.courses where name = 'Digital Art — Procreate';

insert into public.course_schedules (course_id, day_of_week, start_time, end_time)
select id, 3, '18:00', '19:30' from public.courses where name = 'Digital Art — Procreate';

-- Graphic Design — เสาร์ 15:00-16:30, อาทิตย์ 10:00-11:30
insert into public.course_schedules (course_id, day_of_week, start_time, end_time)
select id, 6, '15:00', '16:30' from public.courses where name = 'Graphic Design พื้นฐาน';

insert into public.course_schedules (course_id, day_of_week, start_time, end_time)
select id, 0, '10:00', '11:30' from public.courses where name = 'Graphic Design พื้นฐาน';
