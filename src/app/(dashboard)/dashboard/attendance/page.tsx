import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export const metadata = { title: "การเข้าเรียน — FAC" };

export default async function AttendancePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: attendances } = await supabase
    .from("attendances")
    .select(`
      id, attended_at,
      enrollment:enrollments(
        course:courses(name)
      ),
      session:sessions(session_date, start_time, end_time)
    `)
    .eq("enrollment.student_id", user.id)
    .order("attended_at", { ascending: false });

  const list = (attendances ?? []) as unknown as Array<{
    id: string;
    attended_at: string;
    enrollment: { course: { name: string } } | null;
    session: { session_date: string; start_time: string; end_time: string } | null;
  }>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">ประวัติการเข้าเรียน</h1>
        <p className="mt-1 text-sm text-muted-foreground">บันทึกการเข้าเรียนทั้งหมดของคุณ</p>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-card p-10 text-center text-muted-foreground">
          ยังไม่มีประวัติการเข้าเรียน
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Course</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">วันที่เรียน</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">เวลา</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">เช็คชื่อเมื่อ</th>
              </tr>
            </thead>
            <tbody>
              {list.map((a) => (
                <tr key={a.id} className="border-b border-white/5 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{a.enrollment?.course?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {a.session ? format(new Date(a.session.session_date), "d MMM yyyy", { locale: th }) : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {a.session ? `${a.session.start_time.slice(0, 5)} – ${a.session.end_time.slice(0, 5)}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {format(new Date(a.attended_at), "d MMM yyyy HH:mm", { locale: th })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
