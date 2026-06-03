import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="flex min-h-[88vh] flex-col items-center justify-center px-4 text-center bg-white">
        <div className="max-w-4xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Factory Art Centre
          </p>
          <h1 className="mb-6 text-5xl font-black leading-[1.1] tracking-tight text-balance sm:text-7xl">
            เราเชื่อว่า{" "}
            <span className="relative inline-block">
              <span className="relative z-10">First impression</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-[#11f768] -z-0 sm:h-4" />
            </span>
            <br />
            ของการเรียนศิลปะ
            <br />
            นั้นสำคัญที่สุด
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-base text-muted-foreground sm:text-lg text-balance leading-relaxed">
            สตูดิโอสอนศิลปะและการออกแบบ พร้อมดูแลทุกก้าวด้วยครูผู้เชี่ยวชาญ
            และบรรยากาศที่ออกแบบมาเพื่อการเรียนรู้
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="bg-[#111111] text-white hover:bg-[#111111]/90 px-8">
              <Link href="/register">
                สมัครเรียนเลย <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link href="/courses">ดู Courses ทั้งหมด</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats — Black band */}
      <section className="bg-[#111111] py-14">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: "10+", label: "Courses" },
              { value: "500+", label: "นักเรียน" },
              { value: "5+", label: "ครูผู้เชี่ยวชาญ" },
              { value: "3+", label: "ปีประสบการณ์" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-black text-[#11f768]">{stat.value}</p>
                <p className="mt-1.5 text-sm text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses preview — White */}
      <section className="bg-white py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              หลักสูตร
            </p>
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-4xl font-black tracking-tight">
                เรียนอะไรได้บ้าง?
              </h2>
              <Link href="/courses" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground transition-colors sm:flex items-center gap-1 shrink-0">
                ดูทั้งหมด <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3 border border-border rounded-xl overflow-hidden">
            {[
              { title: "วาดเส้น & สเก็ตช์", desc: "พื้นฐานที่สำคัญของศิลปะทุกแขนง" },
              { title: "สีน้ำ", desc: "เรียนรู้เทคนิคสีน้ำทั้งแบบ wet-on-wet และ wet-on-dry" },
              { title: "Digital Art", desc: "ออกแบบดิจิทัลด้วย Procreate และ Photoshop" },
              { title: "Graphic Design", desc: "ออกแบบสื่อสิ่งพิมพ์และดิจิทัลอย่างมืออาชีพ" },
              { title: "Portrait & Figure", desc: "วาดภาพบุคคลและร่างกายอย่างสมจริง" },
              { title: "Mixed Media", desc: "ผสมผสานวัสดุและเทคนิคหลากหลาย" },
            ].map((course, i) => (
              <div
                key={course.title}
                className="group bg-white p-8 hover:bg-[#11f768] transition-colors duration-200 cursor-default"
              >
                <p className="mb-1 text-xs font-semibold text-muted-foreground group-hover:text-black/50 transition-colors">
                  0{i + 1}
                </p>
                <h3 className="mb-2 text-lg font-bold text-foreground group-hover:text-black transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground group-hover:text-black/70 transition-colors leading-relaxed">
                  {course.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 sm:hidden text-center">
            <Button asChild variant="outline" size="sm">
              <Link href="/courses">ดู Courses ทั้งหมด <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA — Black */}
      <section className="bg-[#111111] py-28 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
            เริ่มต้นวันนี้
          </p>
          <h2 className="mb-6 text-4xl font-black text-white sm:text-5xl text-balance leading-tight">
            พร้อมสร้าง
            <br />
            <span className="text-[#11f768]">First impression</span>
            <br />
            ที่ดีที่สุดแล้วหรือยัง?
          </h2>
          <p className="mb-10 text-white/50 max-w-md mx-auto text-balance">
            สมัครเรียนวันนี้ เริ่มต้นการเดินทางในโลกแห่งศิลปะกับเรา
          </p>
          <Button asChild size="lg" className="bg-[#11f768] text-black hover:bg-[#11f768]/90 font-bold px-10">
            <Link href="/register">
              สมัครเรียนเลย <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

    </div>
  );
}
