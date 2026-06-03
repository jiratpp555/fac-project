"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { href: "/studio", label: "บรรยากาศภายใน Studio" },
  { href: "/teachers", label: "ผู้สอนของเรา" },
  { href: "/courses", label: "Courses" },
  { href: "/map", label: "แผนที่ Studio" },
  { href: "/contact", label: "ติดต่อเรา" },
];

interface NavbarProps {
  user?: { id: string; email?: string } | null;
  role?: string | null;
}

export function Navbar({ user, role }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const dashboardHref = role === "admin" ? "/admin" : "/dashboard";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-xl font-black tracking-widest text-foreground">FAC</span>
            <span className="hidden text-xs text-muted-foreground sm:block mt-0.5">
              Factory Art Centre
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm transition-colors hover:text-foreground ${
                  pathname === link.href
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href={dashboardHref}>
                    {role === "admin" ? "Admin Panel" : "My Dashboard"}
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  ออกจากระบบ
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">เข้าสู่ระบบ</Link>
                </Button>
                <Button asChild size="sm" className="bg-foreground text-background hover:bg-foreground/90">
                  <Link href="/register">สมัครเรียน</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-white border-border">
              <div className="flex flex-col gap-1 pt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-md px-4 py-3 text-sm transition-colors hover:bg-muted ${
                      pathname === link.href
                        ? "font-semibold text-foreground bg-muted"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                  {user ? (
                    <>
                      <Button asChild variant="ghost" size="sm" onClick={() => setOpen(false)}>
                        <Link href={dashboardHref}>
                          {role === "admin" ? "Admin Panel" : "My Dashboard"}
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleLogout}>
                        ออกจากระบบ
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="ghost" size="sm" onClick={() => setOpen(false)}>
                        <Link href="/login">เข้าสู่ระบบ</Link>
                      </Button>
                      <Button asChild size="sm" className="bg-foreground text-background" onClick={() => setOpen(false)}>
                        <Link href="/register">สมัครเรียน</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
