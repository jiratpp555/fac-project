export function enrollmentConfirmedEmail({
  studentName,
  courseName,
  totalSessions,
  schedules,
  price,
}: {
  studentName: string;
  courseName: string;
  totalSessions: number;
  schedules: string[];
  price: number;
}) {
  return {
    subject: `ยืนยันการสมัครเรียน — ${courseName}`,
    html: `
<!DOCTYPE html>
<html lang="th">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#111111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:40px auto;padding:0 16px;">
    <div style="background:#111111;border:1px solid rgba(255,255,255,0.1);border-radius:12px;overflow:hidden;">
      <!-- Header -->
      <div style="padding:32px 32px 24px;border-bottom:1px solid rgba(255,255,255,0.1);">
        <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:4px;color:#11f768;">FAC</p>
        <p style="margin:4px 0 0;font-size:12px;color:#888;">Factory Art Centre</p>
      </div>
      <!-- Body -->
      <div style="padding:32px;">
        <h1 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#fff;">ยืนยันการสมัครเรียนเรียบร้อยแล้ว! 🎨</h1>
        <p style="margin:0 0 24px;color:#888;font-size:14px;">สวัสดี ${studentName}</p>

        <div style="background:rgba(17,247,104,0.08);border:1px solid rgba(17,247,104,0.2);border-radius:8px;padding:20px;margin-bottom:24px;">
          <p style="margin:0 0 12px;font-size:16px;font-weight:600;color:#11f768;">${courseName}</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:4px 0;color:#888;font-size:13px;width:120px;">จำนวนครั้ง</td>
              <td style="padding:4px 0;color:#fff;font-size:13px;font-weight:500;">${totalSessions} ครั้ง</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#888;font-size:13px;">ค่าเรียน</td>
              <td style="padding:4px 0;color:#fff;font-size:13px;font-weight:500;">฿${price.toLocaleString()}</td>
            </tr>
            ${schedules.length > 0 ? `
            <tr>
              <td style="padding:4px 0;color:#888;font-size:13px;vertical-align:top;">ตารางเรียน</td>
              <td style="padding:4px 0;color:#fff;font-size:13px;font-weight:500;">${schedules.join("<br>")}</td>
            </tr>` : ""}
          </table>
        </div>

        <p style="margin:0 0 8px;color:#888;font-size:13px;line-height:1.6;">
          ขอให้สนุกกับการเรียนนะคะ! หากมีคำถามหรือต้องการข้อมูลเพิ่มเติม ติดต่อเราได้เลย
        </p>
      </div>
      <!-- Footer -->
      <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.1);text-align:center;">
        <p style="margin:0;font-size:12px;color:#555;">© ${new Date().getFullYear()} Factory Art Centre</p>
      </div>
    </div>
  </div>
</body>
</html>`,
  };
}

export function courseExpiryReminderEmail({
  studentName,
  courseName,
  sessionsRemaining,
}: {
  studentName: string;
  courseName: string;
  sessionsRemaining: number;
}) {
  return {
    subject: `แจ้งเตือน: Course "${courseName}" ของคุณใกล้หมดแล้ว`,
    html: `
<!DOCTYPE html>
<html lang="th">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#111111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:40px auto;padding:0 16px;">
    <div style="background:#111111;border:1px solid rgba(255,255,255,0.1);border-radius:12px;overflow:hidden;">
      <div style="padding:32px 32px 24px;border-bottom:1px solid rgba(255,255,255,0.1);">
        <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:4px;color:#11f768;">FAC</p>
        <p style="margin:4px 0 0;font-size:12px;color:#888;">Factory Art Centre</p>
      </div>
      <div style="padding:32px;">
        <h1 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#fff;">Course ของคุณใกล้หมดแล้ว ⏰</h1>
        <p style="margin:0 0 24px;color:#888;font-size:14px;">สวัสดี ${studentName}</p>

        <div style="background:rgba(234,179,8,0.08);border:1px solid rgba(234,179,8,0.2);border-radius:8px;padding:20px;margin-bottom:24px;">
          <p style="margin:0 0 8px;font-size:16px;font-weight:600;color:#eab308;">${courseName}</p>
          <p style="margin:0;color:#fff;font-size:14px;">เหลืออีก <strong style="color:#eab308;">${sessionsRemaining} ครั้ง</strong> ก่อนครบ Course</p>
        </div>

        <p style="margin:0 0 16px;color:#888;font-size:13px;line-height:1.6;">
          หาก Course หมดแล้วต้องการเรียนต่อ ติดต่อ admin ได้เลย เพื่อต่อ Course ใหม่
        </p>

        <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses"
           style="display:inline-block;background:#11f768;color:#111;font-weight:600;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">
          ดู Courses เพิ่มเติม
        </a>
      </div>
      <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.1);text-align:center;">
        <p style="margin:0;font-size:12px;color:#555;">© ${new Date().getFullYear()} Factory Art Centre</p>
      </div>
    </div>
  </div>
</body>
</html>`,
  };
}
