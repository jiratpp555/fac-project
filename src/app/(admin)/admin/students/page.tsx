import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export const metadata = { title: "นักเรียน — FAC Admin" };

export default async function StudentsPage() {
  const supabase = await createClient();

  const { data: students } = await supabase
    .from("profiles")
    .select(`
      id, full_name, email, phone, created_at,
      enrollments:enrollments(id, status, course:courses(name))
    `)
    .eq("role", "student")
    .order("created_at", { ascending: false });

  const list = (students ?? []) as any[];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">นักเรียนทั้งหมด</h1>
          <p className="mt-1 text-sm text-muted-foreground">{list.length} คน</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-muted/50">
              {["ชื่อ", "ติดต่อ", "Courses", "วันที่สมัคร"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">ยังไม่มีนักเรียน</td></tr>
            ) : list.map((s) => {
              const confirmed = s.enrollments?.filter((e: any) => e.status === "confirmed") ?? [];
              const pending = s.enrollments?.filter((e: any) => e.status === "pending") ?? [];
              return (
                <tr key={s.id} className="border-b border-white/5 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium">{s.full_name}</td>
                  <td className="px-4 py-3">
                    <p className="text-muted-foreground">{s.email}</p>
                    {s.phone && <p className="text-xs text-muted-foreground">{s.phone}</p>}
                  </td>
                  <td className="px-4 py-3">
                    {confirmed.map((e: any) => (
                      <span key={e.id} className="mr-1 mb-1 inline-block rounded bg-green-400/10 border border-green-400/20 px-2 py-0.5 text-xs text-green-400">
                        {e.course?.name}
                      </span>
                    ))}
                    {pending.map((e: any) => (
                      <span key={e.id} className="mr-1 mb-1 inline-block rounded bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 text-xs text-yellow-400">
                        {e.course?.name} (รอ)
                      </span>
                    ))}
                    {s.enrollments?.length === 0 && <span className="text-xs text-muted-foreground">ยังไม่มี course</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {format(new Date(s.created_at), "d MMM yyyy", { locale: th })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
