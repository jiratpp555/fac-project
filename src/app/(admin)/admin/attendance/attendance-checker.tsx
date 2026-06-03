"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CheckCircle2, Plus, Calendar } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface Session { id: string; session_date: string; start_time: string; course: { name: string } | null; }
interface Enrollment { id: string; sessions_remaining: number; student: { full_name: string; email: string } | null; course: { id: string; name: string } | null; }

interface Props { sessions: Session[]; enrollments: Enrollment[]; }

export function AttendanceChecker({ sessions, enrollments }: Props) {
  const router = useRouter();
  const [selectedSession, setSelectedSession] = useState("");
  const [checking, setChecking] = useState<string | null>(null);
  const [attendedIds, setAttendedIds] = useState<Set<string>>(new Set());

  // Create new session
  const [newSession, setNewSession] = useState({ course_id: "", date: "", start_time: "", end_time: "" });
  const [creating, setCreating] = useState(false);

  const courseMap = new Map<string, { id: string; name: string }>();
  for (const e of enrollments) {
    if (e.course?.id) courseMap.set(e.course.id, e.course as { id: string; name: string });
  }
  const uniqueCourses = Array.from(courseMap.values());

  const sessionEnrollments = selectedSession
    ? enrollments.filter((e) => {
        const session = sessions.find((s) => s.id === selectedSession);
        return session && e.course?.name === session.course?.name;
      })
    : [];

  async function checkAttendance(enrollmentId: string) {
    if (!selectedSession) return;
    setChecking(enrollmentId);
    const supabase = createClient();
    const { error } = await supabase.from("attendances").insert({
      enrollment_id: enrollmentId,
      session_id: selectedSession,
    });
    if (error?.code === "23505") {
      toast.info("นักเรียนคนนี้เช็คชื่อแล้ว");
    } else if (error) {
      toast.error("เช็คชื่อไม่สำเร็จ: " + error.message);
    } else {
      setAttendedIds((prev) => new Set([...prev, enrollmentId]));
      toast.success("เช็คชื่อสำเร็จ");
      router.refresh();
    }
    setChecking(null);
  }

  async function createSession() {
    if (!newSession.course_id || !newSession.date || !newSession.start_time || !newSession.end_time) {
      toast.error("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    setCreating(true);
    const supabase = createClient();
    const { error } = await supabase.from("sessions").insert({
      course_id: newSession.course_id,
      session_date: newSession.date,
      start_time: newSession.start_time,
      end_time: newSession.end_time,
    });
    if (error) toast.error("สร้าง session ไม่สำเร็จ");
    else { toast.success("สร้าง session สำเร็จ"); router.refresh(); setNewSession({ course_id: "", date: "", start_time: "", end_time: "" }); }
    setCreating(false);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Create Session */}
      <div className="lg:col-span-1">
        <div className="rounded-xl border border-white/10 bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4 fac-green" />
            <h2 className="font-semibold">สร้าง Session ใหม่</h2>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <Label className="text-xs">Course</Label>
              <Select value={newSession.course_id} onValueChange={(v) => setNewSession({ ...newSession, course_id: v ?? "" })}>
                <SelectTrigger className="mt-1 h-8 text-xs bg-background border-white/20">
                  <SelectValue placeholder="เลือก Course" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/20">
                  {uniqueCourses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">วันที่</Label>
              <Input type="date" value={newSession.date} onChange={(e) => setNewSession({ ...newSession, date: e.target.value })} className="mt-1 h-8 text-xs bg-background border-white/20" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">เริ่ม</Label>
                <Input type="time" value={newSession.start_time} onChange={(e) => setNewSession({ ...newSession, start_time: e.target.value })} className="mt-1 h-8 text-xs bg-background border-white/20" />
              </div>
              <div>
                <Label className="text-xs">สิ้นสุด</Label>
                <Input type="time" value={newSession.end_time} onChange={(e) => setNewSession({ ...newSession, end_time: e.target.value })} className="mt-1 h-8 text-xs bg-background border-white/20" />
              </div>
            </div>
            <Button size="sm" onClick={createSession} disabled={creating} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {creating ? "กำลังสร้าง..." : "สร้าง Session"}
            </Button>
          </div>
        </div>
      </div>

      {/* Check Attendance */}
      <div className="lg:col-span-2">
        <div className="rounded-xl border border-white/10 bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 fac-green" />
            <h2 className="font-semibold">เช็คชื่อ</h2>
          </div>

          <div className="mb-4">
            <Label className="text-xs">เลือก Session</Label>
            <Select value={selectedSession} onValueChange={(v) => setSelectedSession(v ?? "")}>
              <SelectTrigger className="mt-1 bg-background border-white/20">
                <SelectValue placeholder="เลือก Session วันนี้" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/20">
                {sessions.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.course?.name} — {format(new Date(s.session_date), "d MMM yyyy", { locale: th })} {s.start_time.slice(0, 5)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!selectedSession ? (
            <p className="text-center text-sm text-muted-foreground py-8">เลือก Session ก่อนเช็คชื่อ</p>
          ) : sessionEnrollments.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">ไม่มีนักเรียนใน session นี้</p>
          ) : (
            <div className="flex flex-col gap-2">
              {sessionEnrollments.map((e) => {
                const done = attendedIds.has(e.id);
                return (
                  <div key={e.id} className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${done ? "border-green-400/20 bg-green-400/5" : "border-white/10 bg-background"}`}>
                    <div>
                      <p className="text-sm font-medium">{e.student?.full_name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">เหลือ {e.sessions_remaining} ครั้ง</p>
                    </div>
                    <Button
                      size="sm"
                      disabled={done || checking === e.id}
                      onClick={() => checkAttendance(e.id)}
                      variant={done ? "secondary" : "default"}
                      className={done ? "" : "bg-primary text-primary-foreground hover:bg-primary/90"}
                    >
                      {done ? <><CheckCircle2 className="mr-1 h-3.5 w-3.5" /> เช็คแล้ว</> : checking === e.id ? "..." : "เช็คชื่อ"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
