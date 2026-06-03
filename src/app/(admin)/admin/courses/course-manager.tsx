"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Course } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

interface Props {
  courses: Course[];
  teachers: { id: string; name: string }[];
}

const emptyForm = {
  name: "",
  description: "",
  price: "",
  total_sessions: "",
  duration_minutes: "60",
  teacher_id: "",
};

export function CourseManager({ courses, teachers }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(course: Course) {
    setEditing(course);
    setForm({
      name: course.name,
      description: course.description ?? "",
      price: course.price.toString(),
      total_sessions: course.total_sessions.toString(),
      duration_minutes: course.duration_minutes.toString(),
      teacher_id: course.teacher_id ?? "",
    });
    setOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.price || !form.total_sessions) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็น (ชื่อ, ราคา, จำนวนครั้ง)");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const payload = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      total_sessions: parseInt(form.total_sessions),
      duration_minutes: parseInt(form.duration_minutes) || 60,
      teacher_id: form.teacher_id || null,
    };

    const { error } = editing
      ? await supabase
          .from("courses")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", editing.id)
      : await supabase.from("courses").insert(payload);

    if (error) {
      toast.error("บันทึกไม่สำเร็จ: " + error.message);
    } else {
      toast.success(editing ? "แก้ไข Course สำเร็จ" : "เพิ่ม Course สำเร็จ");
      setOpen(false);
      router.refresh();
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("courses").delete().eq("id", deleteTarget.id);
    if (error) {
      toast.error("ลบไม่สำเร็จ: " + error.message);
    } else {
      toast.success(`ลบ "${deleteTarget.name}" เรียบร้อยแล้ว`);
      setDeleteTarget(null);
      router.refresh();
    }
    setDeleting(false);
  }

  async function toggleActive(course: Course) {
    const supabase = createClient();
    await supabase.from("courses").update({ is_active: !course.is_active }).eq("id", course.id);
    toast.success(course.is_active ? `ปิด "${course.name}" แล้ว` : `เปิด "${course.name}" แล้ว`);
    router.refresh();
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate} className="bg-[#11f768] text-black hover:bg-[#11f768]/90 font-semibold">
          <Plus className="mr-1.5 h-4 w-4" /> เพิ่ม Course
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              {["ชื่อ Course", "ราคา", "จำนวนครั้ง", "ครู", "สถานะ", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  ยังไม่มี Course —{" "}
                  <button onClick={openCreate} className="text-[#11f768] hover:underline">
                    เพิ่ม Course แรก
                  </button>
                </td>
              </tr>
            ) : (
              courses.map((c) => (
                <tr key={c.id} className={`border-b border-white/5 transition-colors hover:bg-white/5 ${!c.is_active ? "opacity-50" : ""}`}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{c.name}</p>
                    {c.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{c.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">฿{c.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {c.total_sessions} ครั้ง
                    <span className="ml-1 text-xs">({c.duration_minutes} นาที)</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {(c.teacher as any)?.name ?? <span className="text-white/30">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(c)}
                      className={`flex items-center gap-1 text-xs transition-colors ${
                        c.is_active ? "text-[#11f768] hover:text-[#11f768]/70" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {c.is_active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      {c.is_active ? "เปิด" : "ปิด"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(c)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        title="แก้ไข"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteTarget(c)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-red-400"
                        title="ลบ"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-white/10 max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "แก้ไข Course" : "เพิ่ม Course ใหม่"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div>
              <Label>ชื่อ Course <span className="text-red-400">*</span></Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 bg-background border-white/20"
                placeholder="เช่น วาดเส้น & สเก็ตช์"
                autoFocus
              />
            </div>
            <div>
              <Label>คำอธิบาย</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 bg-background border-white/20 resize-none"
                rows={2}
                placeholder="อธิบายรายละเอียด Course"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>ราคา (฿) <span className="text-red-400">*</span></Label>
                <Input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="mt-1 bg-background border-white/20"
                  placeholder="2500"
                />
              </div>
              <div>
                <Label>จำนวนครั้ง <span className="text-red-400">*</span></Label>
                <Input
                  type="number"
                  min="1"
                  value={form.total_sessions}
                  onChange={(e) => setForm({ ...form, total_sessions: e.target.value })}
                  className="mt-1 bg-background border-white/20"
                  placeholder="10"
                />
              </div>
              <div>
                <Label>นาที/ครั้ง</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.duration_minutes}
                  onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                  className="mt-1 bg-background border-white/20"
                  placeholder="60"
                />
              </div>
            </div>
            <div>
              <Label>ครูผู้สอน</Label>
              <Select
                value={form.teacher_id}
                onValueChange={(v) => setForm({ ...form, teacher_id: v ?? "" })}
              >
                <SelectTrigger className="mt-1 bg-background border-white/20">
                  <SelectValue placeholder="เลือกครู (ถ้ามี)" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/20">
                  {teachers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>ยกเลิก</Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#11f768] text-black hover:bg-[#11f768]/90 font-semibold"
            >
              {saving ? "กำลังบันทึก..." : editing ? "บันทึกการแก้ไข" : "เพิ่ม Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="bg-card border-white/10 max-w-sm">
          <DialogHeader>
            <DialogTitle>ยืนยันการลบ</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            ต้องการลบ <span className="font-semibold text-foreground">"{deleteTarget?.name}"</span> ออกจากระบบหรือไม่?
            <br />
            <span className="text-red-400 text-xs mt-1 block">
              ข้อมูลการสมัครเรียนที่เชื่อมกับ Course นี้จะถูกกระทบด้วย
            </span>
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>ยกเลิก</Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
            >
              {deleting ? "กำลังลบ..." : "ลบ Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
