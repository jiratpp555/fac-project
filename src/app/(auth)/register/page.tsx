"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface CourseOption {
  id: string;
  name: string;
  price: number;
  total_sessions: number;
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    courseId: "",
    note: "",
  });

  async function loadCourses() {
    const supabase = createClient();
    const { data } = await supabase
      .from("courses")
      .select("id, name, price, total_sessions")
      .eq("is_active", true)
      .order("name");
    setCourses((data ?? []) as CourseOption[]);
  }

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("รหัสผ่านไม่ตรงกัน");
      return;
    }
    if (form.password.length < 6) {
      toast.error("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }
    await loadCourses();
    setStep(2);
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    if (!form.courseId) {
      toast.error("กรุณาเลือก Course ที่ต้องการสมัคร");
      return;
    }
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.fullName, role: "student" },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("enrollments").insert({
        student_id: data.user.id,
        course_id: form.courseId,
        status: "pending",
        note: form.note || null,
      });

      await supabase.from("profiles").update({ phone: form.phone }).eq("id", data.user.id);
    }

    toast.success("สมัครเสร็จสิ้น! รอ admin ยืนยันการชำระเงินนะครับ");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-white/10 bg-card p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          {[1, 2].map((s) => (
            <div key={s} className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
              step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {s}
            </div>
          ))}
          <div className="h-px flex-1 bg-border" />
        </div>
        <h1 className="text-2xl font-bold">{step === 1 ? "สมัครสมาชิก" : "เลือก Course"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {step === 1 ? "กรอกข้อมูลส่วนตัวของคุณ" : "เลือก Course ที่ต้องการเรียน"}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleStep1} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="fullName">ชื่อ-นามสกุล</Label>
            <Input id="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="ชื่อ นามสกุล" required className="mt-1 bg-background border-white/20" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required className="mt-1 bg-background border-white/20" />
            </div>
            <div>
              <Label htmlFor="phone">เบอร์โทร</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0X-XXXX-XXXX" className="mt-1 bg-background border-white/20" />
            </div>
          </div>
          <div>
            <Label htmlFor="password">รหัสผ่าน</Label>
            <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="อย่างน้อย 6 ตัวอักษร" required className="mt-1 bg-background border-white/20" />
          </div>
          <div>
            <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
            <Input id="confirmPassword" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="••••••••" required className="mt-1 bg-background border-white/20" />
          </div>
          <Button type="submit" className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90">
            ถัดไป →
          </Button>
        </form>
      ) : (
        <form onSubmit={handleStep2} className="flex flex-col gap-4">
          <div>
            <Label>เลือก Course</Label>
            <Select value={form.courseId} onValueChange={(v) => setForm({ ...form, courseId: v ?? "" })}>
              <SelectTrigger className="mt-1 bg-background border-white/20">
                <SelectValue placeholder="เลือก Course ที่ต้องการ" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/20">
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} — {c.total_sessions} ครั้ง ({c.price.toLocaleString()} ฿)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="note">หมายเหตุ (ถ้ามี)</Label>
            <Textarea id="note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="ข้อมูลเพิ่มเติม เช่น วันที่สะดวกเรียน..." rows={3} className="mt-1 bg-background border-white/20 resize-none" />
          </div>
          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 text-sm text-yellow-400">
            หลังสมัคร กรุณาโอนเงินและส่ง slip ให้ admin เพื่อยืนยันการเข้าเรียน
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 border-white/20">
              ← กลับ
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              {loading ? "กำลังสมัคร..." : "ยืนยันการสมัคร"}
            </Button>
          </div>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        มีบัญชีแล้ว?{" "}
        <Link href="/login" className="fac-green hover:underline">
          เข้าสู่ระบบ
        </Link>
      </p>
    </div>
  );
}
