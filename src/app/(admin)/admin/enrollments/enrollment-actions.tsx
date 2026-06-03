"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";

interface Props {
  enrollment: {
    id: string;
    status: string;
    student_id: string;
    course_id: string;
    payslip_url: string | null;
    course?: { total_sessions: number; name: string };
    student?: { email: string; full_name: string };
  };
}

export function EnrollmentActions({ enrollment }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(enrollment.status);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [payslipUrl, setPayslipUrl] = useState(enrollment.payslip_url ?? "");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const path = `payslips/${enrollment.id}-${Date.now()}.${file.name.split(".").pop()}`;
    const { data, error } = await supabase.storage.from("payslips").upload(path, file, { upsert: true });
    if (error) {
      toast.error("อัปโหลด slip ล้มเหลว");
    } else {
      const { data: { publicUrl } } = supabase.storage.from("payslips").getPublicUrl(path);
      setPayslipUrl(publicUrl);
      toast.success("อัปโหลด slip สำเร็จ");
    }
    setUploading(false);
  }

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();

    const updates: Record<string, unknown> = {
      status,
      payslip_url: payslipUrl || null,
      updated_at: new Date().toISOString(),
    };

    if (status === "confirmed" && enrollment.status !== "confirmed") {
      updates.paid_at = new Date().toISOString();
      updates.enrolled_at = new Date().toISOString();
      updates.sessions_remaining = enrollment.course?.total_sessions ?? 0;
    }

    const { error } = await supabase
      .from("enrollments")
      .update(updates)
      .eq("id", enrollment.id);

    if (error) {
      toast.error("บันทึกไม่สำเร็จ");
    } else {
      // Send confirmation email if just confirmed
      if (status === "confirmed" && enrollment.status !== "confirmed") {
        await fetch("/api/email/enrollment-confirmed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enrollmentId: enrollment.id }),
        });
      }
      toast.success("บันทึกสำเร็จ");
      setOpen(false);
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)} className="border-white/20 text-xs h-7">
        จัดการ
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle>จัดการการสมัคร</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div>
              <p className="text-sm font-medium">{enrollment.student?.full_name}</p>
              <p className="text-xs text-muted-foreground">{enrollment.course?.name}</p>
            </div>

            <div>
              <Label>สถานะ</Label>
              <Select value={status} onValueChange={(v) => setStatus(v ?? status)}>
                <SelectTrigger className="mt-1 bg-background border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/20">
                  <SelectItem value="pending">รอยืนยัน</SelectItem>
                  <SelectItem value="confirmed">ยืนยันแล้ว (ชำระแล้ว)</SelectItem>
                  <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                  <SelectItem value="cancelled">ยกเลิก</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Payslip</Label>
              <div className="mt-1 flex gap-2">
                <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleUpload} />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="border-white/20"
                >
                  <Upload className="mr-1.5 h-3.5 w-3.5" />
                  {uploading ? "กำลังอัปโหลด..." : "อัปโหลด Slip"}
                </Button>
                {payslipUrl && (
                  <a href={payslipUrl} target="_blank" rel="noopener noreferrer" className="fac-green text-sm self-center hover:underline">
                    ดู Slip
                  </a>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {saving ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
