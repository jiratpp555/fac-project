import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export const metadata = { title: "Monthly Summary — FAC Admin" };

export default async function SummaryPage() {
  const supabase = await createClient();

  // Get confirmed enrollments with course + date info
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id, paid_at, course:courses(name, price)")
    .eq("status", "confirmed")
    .not("paid_at", "is", null)
    .order("paid_at", { ascending: false });

  const list = (enrollments ?? []) as unknown as Array<{
    id: string;
    paid_at: string;
    course: { name: string; price: number } | null;
  }>;

  // Group by month
  const monthMap = new Map<string, { month: string; courses: Record<string, { count: number; revenue: number }>; totalRevenue: number }>();

  for (const e of list) {
    const monthKey = format(new Date(e.paid_at), "yyyy-MM");
    const monthLabel = format(new Date(e.paid_at), "MMMM yyyy", { locale: th });
    const courseName = e.course?.name ?? "ไม่ระบุ";
    const price = e.course?.price ?? 0;

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, { month: monthLabel, courses: {}, totalRevenue: 0 });
    }
    const m = monthMap.get(monthKey)!;
    if (!m.courses[courseName]) m.courses[courseName] = { count: 0, revenue: 0 };
    m.courses[courseName].count += 1;
    m.courses[courseName].revenue += price;
    m.totalRevenue += price;
  }

  const months = Array.from(monthMap.entries()).sort((a, b) => b[0].localeCompare(a[0]));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Monthly Financial Summary</h1>
        <p className="mt-1 text-sm text-muted-foreground">สรุปรายได้และจำนวนนักเรียนรายเดือน</p>
      </div>

      {months.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-card p-10 text-center text-muted-foreground">
          ยังไม่มีข้อมูล
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {months.map(([key, data]) => (
            <div key={key} className="rounded-xl border border-white/10 bg-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 bg-muted/30 px-5 py-3">
                <h2 className="font-semibold capitalize">{data.month}</h2>
                <span className="fac-green font-bold">฿{data.totalRevenue.toLocaleString()}</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-5 py-2.5 text-left text-xs font-medium text-muted-foreground">Course</th>
                    <th className="px-5 py-2.5 text-right text-xs font-medium text-muted-foreground">จำนวน</th>
                    <th className="px-5 py-2.5 text-right text-xs font-medium text-muted-foreground">รายได้</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data.courses).map(([name, stat]) => (
                    <tr key={name} className="border-b border-white/5 hover:bg-muted/20">
                      <td className="px-5 py-2.5">{name}</td>
                      <td className="px-5 py-2.5 text-right text-muted-foreground">{stat.count} คน</td>
                      <td className="px-5 py-2.5 text-right font-medium">฿{stat.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/20">
                    <td className="px-5 py-2.5 font-medium">รวมทั้งหมด</td>
                    <td className="px-5 py-2.5 text-right text-muted-foreground">
                      {Object.values(data.courses).reduce((s, c) => s + c.count, 0)} คน
                    </td>
                    <td className="px-5 py-2.5 text-right font-bold fac-green">฿{data.totalRevenue.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
