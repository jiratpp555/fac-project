import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const MAINTENANCE_MODE = true; // เปลี่ยนเป็น false เมื่อพร้อม

export default async function proxy(request: NextRequest) {
  if (MAINTENANCE_MODE) {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|maintenance|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
