import { createClient } from "@/lib/supabase/server";
import { Course, DAY_NAMES } from "@/lib/types";
import { CourseManager } from "./course-manager";

export const metadata = { title: "จัดการ Courses — FAC Admin" };

export default async function CoursesAdminPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("*, teacher:teachers(id, name), schedules:course_schedules(*)")
    .order("created_at");

  const { data: teachers } = await supabase
    .from("teachers")
    .select("id, name")
    .eq("is_active", true);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">จัดการ Courses</h1>
        <p className="mt-1 text-sm text-muted-foreground">เพิ่ม แก้ไข และจัดการ Courses ทั้งหมด</p>
      </div>
      <CourseManager
        courses={(courses ?? []) as Course[]}
        teachers={(teachers ?? []) as { id: string; name: string }[]}
      />
    </div>
  );
}
