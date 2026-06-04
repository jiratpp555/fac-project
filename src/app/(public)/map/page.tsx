import { MapPin, Clock, Phone, Mail } from "lucide-react";

export const metadata = { title: "แผนที่ Studio — FAC" };

const EMBED_URL =
  "https://maps.google.com/maps?q=11/1+Soi+Phahon+Yothin+8,+Samsen+Nai,+Phaya+Thai,+Bangkok+10400,+Thailand&output=embed&hl=th&z=17";

const GMAPS_URL =
  "https://www.google.com/maps/search/11/1+Soi+Phahon+Yothin+8,+Samsen+Nai,+Phaya+Thai,+Bangkok+10400,+Thailand";

export default function MapPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black tracking-tight">
          <span className="text-[#11f768]">แผนที่</span> Studio
        </h1>
        <p className="mt-4 text-muted-foreground">มาหาเราได้ที่นี่เลย</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-border aspect-[16/9]">
            <iframe
              src={EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href={GMAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <MapPin className="h-3.5 w-3.5" />
            เปิดใน Google Maps →
          </a>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 font-bold text-lg">Factory Art Centre</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#11f768]" />
                <span className="text-muted-foreground leading-relaxed">
                  11/1 ซอยพหลโยธิน 8<br />
                  แขวงสามเสนใน เขตพญาไท<br />
                  กรุงเทพมหานคร 10400
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#11f768]" />
                <div className="text-muted-foreground">
                  <p>จันทร์ – ศุกร์: 10:00 – 20:00</p>
                  <p>เสาร์ – อาทิตย์: 10:00 – 18:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 shrink-0 text-[#11f768]" />
                <a href="tel:+66000000000" className="text-muted-foreground hover:text-foreground transition-colors">
                  +66 00-000-0000
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-[#11f768]" />
                <a href="mailto:info@factoryartcentre.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  info@factoryartcentre.com
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#11f768]/20 bg-[#11f768]/5 p-5">
            <h3 className="mb-3 font-semibold text-sm">การเดินทาง</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>🚇 BTS สถานีพหลโยธิน 24 (ออก 3) เดินประมาณ 5 นาที</li>
              <li>🚗 มีที่จอดรถบริเวณใกล้เคียง</li>
              <li>🛵 มอเตอร์ไซค์รับจ้างหน้าสถานี BTS</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
