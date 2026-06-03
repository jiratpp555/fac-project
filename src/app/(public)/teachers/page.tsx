import { createClient } from "@/lib/supabase/server";
import { Teacher } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata = { title: "ผู้สอนของเรา — FAC" };

export default async function TeachersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("teachers")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  const teachers = (data ?? []) as Teacher[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold">
          ผู้สอน<span className="fac-green fac-glow">ของเรา</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          ทีมครูผู้เชี่ยวชาญที่พร้อมดูแลคุณทุกก้าว
        </p>
      </div>

      {teachers.length === 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-card p-6 animate-pulse">
              <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-muted" />
              <div className="mx-auto h-4 w-32 rounded bg-muted mb-2" />
              <div className="mx-auto h-3 w-24 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="group rounded-xl border border-white/10 bg-card p-8 text-center transition-all hover:border-primary/30 hover:fac-glow-border"
            >
              <Avatar className="mx-auto mb-4 h-24 w-24 border-2 border-primary/20 group-hover:border-primary/50 transition-colors">
                <AvatarImage src={teacher.image_url ?? undefined} alt={teacher.name} />
                <AvatarFallback className="bg-fac-green-dim text-primary text-xl font-bold">
                  {teacher.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h3 className="mb-1 text-lg font-semibold">{teacher.name}</h3>
              {teacher.specialty && (
                <p className="mb-3 text-sm fac-green">{teacher.specialty}</p>
              )}
              {teacher.bio && (
                <p className="text-sm text-muted-foreground leading-relaxed">{teacher.bio}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
