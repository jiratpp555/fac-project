import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Enrollment } from "@/lib/types";
import { BookOpen, CheckCircle, Clock, AlertCircle } from "lucide-react";

const statusLabel: Record<string, string> = {
  pending: "รอยืนยัน",
  confirmed: "ยืนยันแล้ว",
  completed: "เสร็จสิ้น",
  cancelled: "ยกเลิก",
};

const statusColor: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  confirmed: "text-green-400 bg-green-400/10 border-green-400/20",
  completed: "text-muted-foreground bg-muted border-border",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, course:courses(name, total_sessions, duration_minutes)")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  const list = (enrollments ?? []) as Enrollment[];

  const confirmed = list.filter((e) => e.status === "confirmed");
  const pending = list.filter((e) => e.status === "pending");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          สวัสดี, <span className="fac-green">{profile?.full_name}</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">ยินดีต้อนรับสู่ FAC Studio</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: BookOpen, label: "Course ทั้งหมด", value: list.length, color: "fac-green" },
          { icon: CheckCircle, label: "ยืนยันแล้ว", value: confirmed.length, color: "text-green-400" },
          { icon: Clock, label: "รอยืนยัน", value: pending.length, color: "text-yellow-400" },
          { icon: AlertCircle, label: "ครั้งเรียนคงเหลือ", value: confirmed.reduce((s, e) => s + (e.sessions_remaining ?? 0), 0), color: "fac-green" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-xl border border-white/10 bg-card p-5">
            <Icon className={`mb-3 h-5 w-5 ${color}`} />
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Enrollments */}
      <h2 className="mb-4 font-semibold">Course ของฉัน</h2>
      {list.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-card p-10 text-center text-muted-foreground">
          ยังไม่มี Course — <a href="/courses" className="fac-green hover:underline">ดู Course ทั้งหมด</a>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {list.map((enrollment) => {
            const course = enrollment.course as { name: string; total_sessions: number } | undefined;
            const total = course?.total_sessions ?? 0;
            const remaining = enrollment.sessions_remaining ?? total;
            const attended = total - remaining;
            const pct = total > 0 ? Math.round((attended / total) * 100) : 0;

            return (
              <div key={enrollment.id} className="rounded-xl border border-white/10 bg-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium">{course?.name ?? "—"}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      เรียนแล้ว {attended} / {total} ครั้ง • เหลืออีก {remaining} ครั้ง
                    </p>
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor[enrollment.status]}`}>
                    {statusLabel[enrollment.status]}
                  </span>
                </div>
                {enrollment.status === "confirmed" && (
                  <div className="mt-4">
                    <Progress value={pct} className="h-1.5" />
                    <p className="mt-1 text-right text-xs text-muted-foreground">{pct}% เสร็จสิ้น</p>
                  </div>
                )}
                {enrollment.status === "pending" && (
                  <p className="mt-3 text-xs text-yellow-400">
                    กรุณาโอนเงินและส่ง slip ให้ admin เพื่อยืนยันการเข้าเรียน
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
