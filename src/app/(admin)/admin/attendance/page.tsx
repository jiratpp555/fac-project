import { createClient } from "@/lib/supabase/server";
import { AttendanceChecker } from "./attendance-checker";

export const metadata = { title: "เช็คชื่อ — FAC Admin" };

export default async function AttendancePage() {
  const supabase = await createClient();

  const { data: sessions } = await supabase
    .from("sessions")
    .select("*, course:courses(name)")
    .order("session_date", { ascending: false })
    .limit(30);

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id, sessions_remaining, student:profiles(full_name, email), course:courses(id, name)")
    .eq("status", "confirmed")
    .order("created_at");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">เช็คชื่อ</h1>
        <p className="mt-1 text-sm text-muted-foreground">บันทึกการเข้าเรียนของนักเรียน</p>
      </div>

      <AttendanceChecker
        sessions={(sessions ?? []) as any[]}
        enrollments={(enrollments ?? []) as any[]}
      />
    </div>
  );
}
