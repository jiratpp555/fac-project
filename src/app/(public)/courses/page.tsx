import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Course, DAY_NAMES } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, ArrowRight } from "lucide-react";

export const metadata = { title: "Courses — FAC" };

function formatPrice(price: number) {
  return new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(price);
}

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("*, teacher:teachers(name, specialty), schedules:course_schedules(*)")
    .eq("is_active", true)
    .order("created_at");

  const courses = (data ?? []) as Course[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold">
          หลักสูตร<span className="fac-green fac-glow">ของเรา</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          เลือกเรียนในสาขาที่คุณสนใจ พร้อมตารางที่ยืดหยุ่น
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-card p-6 animate-pulse">
              <div className="mb-4 h-40 rounded-lg bg-muted" />
              <div className="mb-2 h-4 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group flex flex-col rounded-xl border border-white/10 bg-card overflow-hidden transition-all hover:border-primary/30"
            >
              {/* Thumbnail placeholder */}
              <div className="aspect-[16/9] bg-gradient-to-br from-fac-green/10 to-transparent flex items-center justify-center">
                {course.image_url ? (
                  <img src={course.image_url} alt={course.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold fac-green opacity-30">
                    {course.name.charAt(0)}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-snug group-hover:fac-green transition-colors">
                    {course.name}
                  </h3>
                  <Badge variant="secondary" className="shrink-0 text-xs fac-green bg-fac-green-dim border-0">
                    {formatPrice(course.price)}
                  </Badge>
                </div>

                {course.teacher && (
                  <p className="mb-3 text-sm text-muted-foreground">
                    โดย {(course.teacher as { name: string }).name}
                  </p>
                )}

                {course.description && (
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                )}

                <div className="mt-auto flex flex-col gap-2">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {course.total_sessions} ครั้ง
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {course.duration_minutes} นาที/ครั้ง
                    </span>
                  </div>

                  {course.schedules && course.schedules.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {course.schedules.map((s) => (
                        <span key={s.id} className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          {DAY_NAMES[s.day_of_week]} {s.start_time.slice(0, 5)}
                        </span>
                      ))}
                    </div>
                  )}

                  <Button asChild size="sm" className="mt-3 bg-primary text-primary-foreground hover:bg-primary/90 w-full">
                    <Link href="/register">
                      สมัครเรียน <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
