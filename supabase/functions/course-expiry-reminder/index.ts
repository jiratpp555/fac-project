import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const APP_URL = Deno.env.get("APP_URL") ?? "https://factoryartcentre.com";

serve(async () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Find enrollments where sessions_remaining <= total_sessions * 0.25
  // (last 25% of sessions = roughly ~1 week before finishing for weekly classes)
  // More precisely: sessions_remaining == 1 (exactly 1 class left)
  const { data: enrollments, error } = await supabase
    .from("enrollments")
    .select(`
      id, sessions_remaining,
      student:profiles(full_name, email),
      course:courses(name, total_sessions)
    `)
    .eq("status", "confirmed")
    .eq("sessions_remaining", 1);

  if (error) {
    console.error("Query error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  let sent = 0;
  for (const enrollment of (enrollments ?? [])) {
    const student = enrollment.student as { full_name: string; email: string };
    const course = enrollment.course as { name: string };

    const html = `
<!DOCTYPE html>
<html lang="th">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#111111;font-family:sans-serif;">
  <div style="max-width:560px;margin:40px auto;padding:0 16px;">
    <div style="background:#111;border:1px solid rgba(255,255,255,0.1);border-radius:12px;overflow:hidden;">
      <div style="padding:32px 32px 24px;border-bottom:1px solid rgba(255,255,255,0.1);">
        <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:4px;color:#11f768;">FAC</p>
      </div>
      <div style="padding:32px;">
        <h1 style="margin:0 0 8px;font-size:20px;color:#fff;">Course ของคุณใกล้หมดแล้ว ⏰</h1>
        <p style="margin:0 0 24px;color:#888;">สวัสดี ${student.full_name}</p>
        <div style="background:rgba(234,179,8,0.08);border:1px solid rgba(234,179,8,0.2);border-radius:8px;padding:20px;margin-bottom:24px;">
          <p style="margin:0 0 8px;font-size:16px;font-weight:600;color:#eab308;">${course.name}</p>
          <p style="margin:0;color:#fff;font-size:14px;">เหลืออีก <strong style="color:#eab308;">1 ครั้ง</strong> ก่อนครบ Course</p>
        </div>
        <p style="color:#888;font-size:13px;">ติดต่อ admin หากต้องการต่อ Course</p>
        <a href="${APP_URL}/courses" style="display:inline-block;background:#11f768;color:#111;font-weight:600;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">
          ดู Courses เพิ่มเติม
        </a>
      </div>
      <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.1);text-align:center;">
        <p style="margin:0;font-size:12px;color:#555;">© ${new Date().getFullYear()} Factory Art Centre</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "FAC Studio <noreply@factoryartcentre.com>",
        to: student.email,
        subject: `แจ้งเตือน: Course "${course.name}" ของคุณใกล้หมดแล้ว`,
        html,
      }),
    });

    if (res.ok) sent++;
    else console.error("Email fail for", student.email, await res.text());
  }

  return new Response(JSON.stringify({ sent }), {
    headers: { "Content-Type": "application/json" },
  });
});
