import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, ClipboardList, CheckSquare, BookOpen, Users, BarChart3 } from "lucide-react";

const adminNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/enrollments", label: "การสมัครเรียน", icon: ClipboardList },
  { href: "/admin/attendance", label: "เช็คชื่อ", icon: CheckSquare },
  { href: "/admin/courses", label: "จัดการ Courses", icon: BookOpen },
  { href: "/admin/students", label: "นักเรียน", icon: Users },
  { href: "/admin/summary", label: "Monthly Summary", icon: BarChart3 },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <div className="dark flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-white/10 bg-card md:flex">
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <Link href="/" className="text-lg font-bold tracking-widest fac-green">FAC</Link>
          <span className="rounded bg-fac-green-dim px-2 py-0.5 text-xs fac-green border border-fac-green/20">Admin</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {adminNav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <p className="truncate text-sm font-medium">{profile?.full_name}</p>
          <p className="text-xs text-muted-foreground">Administrator</p>
          <form action="/api/auth/signout" method="POST" className="mt-3">
            <Button type="submit" variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" /> ออกจากระบบ
            </Button>
          </form>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 overflow-x-auto border-b border-white/10 bg-card px-4 md:hidden">
          <Link href="/" className="shrink-0 text-lg font-bold tracking-widest fac-green">FAC</Link>
          {adminNav.map(({ href, label }) => (
            <Link key={href} href={href} className="shrink-0 text-xs text-muted-foreground hover:text-foreground whitespace-nowrap">
              {label}
            </Link>
          ))}
        </header>
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
