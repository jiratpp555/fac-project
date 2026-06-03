"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      toast.error(error.message === "Invalid login credentials"
        ? "Email หรือรหัสผ่านไม่ถูกต้อง"
        : error.message
      );
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      router.push(profile?.role === "admin" ? "/admin" : "/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-card p-8">
      <h1 className="mb-1 text-2xl font-bold">เข้าสู่ระบบ</h1>
      <p className="mb-6 text-sm text-muted-foreground">ยินดีต้อนรับกลับมา</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="your@email.com"
            required
            className="mt-1 bg-background border-white/20"
          />
        </div>
        <div>
          <Label htmlFor="password">รหัสผ่าน</Label>
          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            required
            className="mt-1 bg-background border-white/20"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ยังไม่มีบัญชี?{" "}
        <Link href="/register" className="fac-green hover:underline">
          สมัครเรียน
        </Link>
      </p>
    </div>
  );
}
