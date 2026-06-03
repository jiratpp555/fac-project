import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#111111] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <span className="text-2xl font-black tracking-widest">FAC</span>
            <p className="mt-2 text-sm text-white/50 leading-relaxed">
              Factory Art Centre<br />
              สตูดิโอสอนศิลปะและการออกแบบ
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">เมนู</p>
            <div className="flex flex-col gap-2.5">
              {[
                { href: "/studio", label: "บรรยากาศภายใน Studio" },
                { href: "/teachers", label: "ผู้สอนของเรา" },
                { href: "/courses", label: "Courses" },
                { href: "/map", label: "แผนที่ Studio" },
                { href: "/contact", label: "ติดต่อเรา" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">ติดต่อ</p>
            <div className="flex flex-col gap-2.5 text-sm text-white/60">
              <p>กรุงเทพมหานคร</p>
              <a href="mailto:info@factoryartcentre.com" className="hover:text-white transition-colors">
                info@factoryartcentre.com
              </a>
              <Link href="/contact" className="hover:text-white transition-colors">
                ดูรายละเอียด →
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 flex items-center justify-between">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Factory Art Centre
          </p>
          <div className="h-1 w-8 rounded-full bg-[#11f768]" />
        </div>
      </div>
    </footer>
  );
}
