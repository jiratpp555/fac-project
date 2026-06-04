"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast.success("ส่งข้อความสำเร็จ! เราจะติดต่อกลับหาคุณเร็วๆ นี้");
    setForm({ name: "", email: "", phone: "", message: "" });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold">
          <span className="fac-green fac-glow">ติดต่อ</span>เรา
        </h1>
        <p className="mt-4 text-muted-foreground">มีคำถาม? เราพร้อมตอบทุกข้อสงสัย</p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Contact Info */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-white/10 bg-card p-6">
            <h2 className="mb-5 font-semibold">ช่องทางการติดต่อ</h2>
            <div className="flex flex-col gap-5">
              {[
                { icon: Mail, label: "Email", value: "info@factoryartcentre.com", href: "mailto:info@factoryartcentre.com" },
                { icon: Phone, label: "โทรศัพท์", value: "+66 00-000-0000", href: "tel:+66000000000" },
                { icon: MapPin, label: "ที่อยู่", value: "กรุงเทพมหานคร ประเทศไทย", href: "/map" },
              ].map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} className="flex items-start gap-4 group">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-fac-green-dim border border-fac-green/20">
                    <Icon className="h-4 w-4 fac-green" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm group-hover:fac-green transition-colors">{value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-fac-green/20 bg-fac-green-dim p-6">
            <h3 className="mb-2 font-medium fac-green">เวลาทำการ</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>จันทร์ – ศุกร์: 10:00 – 20:00 น.</p>
              <p>เสาร์ – อาทิตย์: 10:00 – 18:00 น.</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-5 font-semibold">ส่งข้อความหาเรา</h2>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="ชื่อของคุณ"
                  required
                  className="mt-1 bg-gray-50 border-gray-300 focus:border-foreground"
                />
              </div>
              <div>
                <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="0X-XXXX-XXXX"
                  className="mt-1 bg-gray-50 border-gray-300 focus:border-foreground"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                required
                className="mt-1 bg-gray-50 border-gray-300 focus:border-foreground"
              />
            </div>
            <div>
              <Label htmlFor="message">ข้อความ</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="คำถาม หรือข้อความที่ต้องการส่งถึงเรา..."
                required
                rows={5}
                className="mt-1 bg-gray-50 border-gray-300 focus:border-foreground resize-none"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {loading ? "กำลังส่ง..." : (
                <>ส่งข้อความ <Send className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
