import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

export const metadata = { title: "ประวัติชำระเงิน — FAC" };

const statusLabel: Record<string, string> = {
  pending: "รอยืนยัน",
  confirmed: "ชำระแล้ว",
  completed: "เสร็จสิ้น",
  cancelled: "ยกเลิก",
};

export default async function PaymentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id, status, paid_at, payslip_url, created_at, course:courses(name, price)")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  const list = (enrollments ?? []) as unknown as Array<{
    id: string;
    status: string;
    paid_at: string | null;
    payslip_url: string | null;
    created_at: string;
    course: { name: string; price: number } | null;
  }>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">ประวัติชำระเงิน</h1>
        <p className="mt-1 text-sm text-muted-foreground">รายการสมัครเรียนและสถานะการชำระเงิน</p>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-card p-10 text-center text-muted-foreground">
          ยังไม่มีประวัติการชำระเงิน
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Course</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">ราคา</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">สถานะ</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">วันชำระ</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Slip</th>
              </tr>
            </thead>
            <tbody>
              {list.map((e) => (
                <tr key={e.id} className="border-b border-white/5 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{e.course?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {e.course ? `฿${e.course.price.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                      e.status === "confirmed" ? "text-green-400 bg-green-400/10 border-green-400/20" :
                      e.status === "pending" ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" :
                      "text-muted-foreground bg-muted border-border"
                    }`}>
                      {statusLabel[e.status] ?? e.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {e.paid_at ? format(new Date(e.paid_at), "d MMM yyyy", { locale: th }) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {e.payslip_url ? (
                      <a href={e.payslip_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 fac-green hover:underline text-xs">
                        ดู Slip <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
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
