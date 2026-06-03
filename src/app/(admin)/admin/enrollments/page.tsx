import { createClient } from "@/lib/supabase/server";
import { EnrollmentActions } from "./enrollment-actions";

export const metadata = { title: "การสมัครเรียน — FAC Admin" };

const statusLabel: Record<string, string> = {
  pending: "รอยืนยัน",
  confirmed: "ยืนยันแล้ว",
  completed: "เสร็จสิ้น",
  cancelled: "ยกเลิก",
};

export default async function EnrollmentsPage() {
  const supabase = await createClient();
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, student:profiles(full_name, email, phone), course:courses(name, price, total_sessions)")
    .order("created_at", { ascending: false });

  const list = (enrollments ?? []) as any[];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">การสมัครเรียน</h1>
        <p className="mt-1 text-sm text-muted-foreground">ยืนยันการสมัครและแนบ payslip</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-muted/50">
              {["นักเรียน", "Course", "สถานะ", "วันที่สมัคร", "Payslip", "จัดการ"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">ไม่มีข้อมูล</td>
              </tr>
            ) : list.map((e) => (
              <tr key={e.id} className="border-b border-white/5 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium">{e.student?.full_name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">{e.student?.email}</p>
                  {e.student?.phone && <p className="text-xs text-muted-foreground">{e.student.phone}</p>}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{e.course?.name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">฿{e.course?.price?.toLocaleString()} • {e.course?.total_sessions} ครั้ง</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                    e.status === "confirmed" ? "text-green-400 bg-green-400/10 border-green-400/20" :
                    e.status === "pending" ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" :
                    e.status === "cancelled" ? "text-red-400 bg-red-400/10 border-red-400/20" :
                    "text-muted-foreground bg-muted border-border"
                  }`}>
                    {statusLabel[e.status]}
                  </span>
                  {e.note && <p className="mt-1 text-xs text-muted-foreground">{e.note}</p>}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(e.created_at).toLocaleDateString("th-TH")}
                </td>
                <td className="px-4 py-3">
                  {e.payslip_url ? (
                    <a href={e.payslip_url} target="_blank" rel="noopener noreferrer" className="fac-green hover:underline text-xs">ดู Slip</a>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <EnrollmentActions enrollment={e} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
