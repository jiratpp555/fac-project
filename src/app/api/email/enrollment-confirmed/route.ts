import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { enrollmentConfirmedEmail } from "@/lib/email/templates";
import { DAY_NAMES } from "@/lib/types";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { enrollmentId } = await request.json();
  if (!enrollmentId) return NextResponse.json({ error: "enrollmentId required" }, { status: 400 });

  const supabase = await createClient();
  const { data: enrollment, error } = await supabase
    .from("enrollments")
    .select(`
      *,
      student:profiles(full_name, email),
      course:courses(name, price, total_sessions, schedules:course_schedules(*))
    `)
    .eq("id", enrollmentId)
    .single();

  if (error || !enrollment) {
    return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
  }

  const student = enrollment.student as { full_name: string; email: string };
  const course = enrollment.course as { name: string; price: number; total_sessions: number; schedules: { day_of_week: number; start_time: string; end_time: string }[] };

  const scheduleStrings = (course.schedules ?? []).map(
    (s) => `${DAY_NAMES[s.day_of_week]} ${s.start_time.slice(0, 5)}–${s.end_time.slice(0, 5)}`
  );

  const { subject, html } = enrollmentConfirmedEmail({
    studentName: student.full_name,
    courseName: course.name,
    totalSessions: course.total_sessions,
    schedules: scheduleStrings,
    price: course.price,
  });

  const { error: emailError } = await resend.emails.send({
    from: "FAC Studio <noreply@factoryartcentre.com>",
    to: student.email,
    subject,
    html,
  });

  if (emailError) {
    console.error("Email send error:", emailError);
    return NextResponse.json({ error: emailError }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
