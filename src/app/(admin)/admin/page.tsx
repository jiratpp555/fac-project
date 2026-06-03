import { createClient } from "@/lib/supabase/server";
import { Users, BookOpen, ClipboardList, TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Admin Overview — FAC" };

export default async function AdminPage() {
  const supabase = await createClient();

  const [
    { count: totalStudents },
    { count: totalCourses },
    { count: pendingEnrollments },
    { count: confirmedEnrollments },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
    supabase.from("courses").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
  ]);

  const stats = [
    { icon: Users, label: "นักเรียนทั้งหมด", value: totalStudents ?? 0, href: "/admin/students", color: "fac-green" },
    { icon: BookOpen, label: "Courses ที่เปิดสอน", value: totalCourses ?? 0, href: "/admin/courses", color: "text-blue-400" },
    { icon: ClipboardList, label: "รอยืนยัน", value: pendingEnrollments ?? 0, href: "/admin/enrollments", color: "text-yellow-400" },
    { icon: TrendingUp, label: "กำลังเรียน", value: confirmedEnrollments ?? 0, href: "/admin/summary", color: "text-green-400" },
  ];

  // Recent pending enrollments
  const { data: recentPending } = await supabase
    .from("enrollments")
    .select("id, created_at, student:profiles(full_name, email), course:courses(name)")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">ภาพรวมของ FAC Studio</p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(({ icon: Icon, label, value, href, color }) => (
          <Link key={label} href={href} className="group rounded-xl border border-white/10 bg-card p-5 transition-all hover:border-primary/30">
            <Icon className={`mb-3 h-5 w-5 ${color}`} />
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{label}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="font-semibold">รอยืนยันล่าสุด</h2>
          <Link href="/admin/enrollments" className="text-xs fac-green hover:underline">ดูทั้งหมด →</Link>
        </div>
        {!recentPending || recentPending.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">ไม่มีรายการรอยืนยัน</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-muted/30">
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">นักเรียน</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Course</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">วันที่สมัคร</th>
              </tr>
            </thead>
            <tbody>
              {recentPending.map((e: any) => (
                <tr key={e.id} className="border-b border-white/5 hover:bg-muted/30">
                  <td className="px-5 py-3">
                    <p className="font-medium">{e.student?.full_name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{e.student?.email}</p>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{e.course?.name ?? "—"}</td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">
                    {new Date(e.created_at).toLocaleDateString("th-TH")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
