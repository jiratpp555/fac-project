export type Role = "student" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface Teacher {
  id: string;
  name: string;
  bio: string | null;
  specialty: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Course {
  id: string;
  name: string;
  description: string | null;
  price: number;
  total_sessions: number;
  duration_minutes: number;
  image_url: string | null;
  teacher_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  teacher?: Teacher;
  schedules?: CourseSchedule[];
}

export interface CourseSchedule {
  id: string;
  course_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export type EnrollmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  status: EnrollmentStatus;
  sessions_remaining: number | null;
  enrolled_at: string | null;
  paid_at: string | null;
  payslip_url: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  student?: Profile;
  course?: Course;
}

export interface Session {
  id: string;
  course_id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  notes: string | null;
  created_at: string;
  course?: Course;
}

export interface Attendance {
  id: string;
  enrollment_id: string;
  session_id: string;
  attended_at: string;
  enrollment?: Enrollment;
  session?: Session;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export const DAY_NAMES = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
