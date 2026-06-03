import { MapPin, Clock, Phone, Mail } from "lucide-react";

export const metadata = { title: "แผนที่ Studio — FAC" };

export default function MapPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold">
          <span className="fac-green fac-glow">แผนที่</span> Studio
        </h1>
        <p className="mt-4 text-muted-foreground">มาหาเราได้ที่นี่เลย</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-white/10 aspect-[16/9]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5!2d100.5!3d13.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ1JzAwLjAiTiAxMDDCsDMwJzAwLjAiRQ!5e0!3m2!1sth!2sth!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-white/10 bg-card p-6">
            <h2 className="mb-4 font-semibold text-lg">Factory Art Centre</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 fac-green" />
                <span className="text-muted-foreground">
                  กรุงเทพมหานคร ประเทศไทย
                  <br />
                  (อัปเดตที่อยู่ใน admin)
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 fac-green" />
                <div className="text-muted-foreground">
                  <p>จันทร์ – ศุกร์: 10:00 – 20:00</p>
                  <p>เสาร์ – อาทิตย์: 10:00 – 18:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 shrink-0 fac-green" />
                <a href="tel:+66000000000" className="text-muted-foreground hover:text-primary transition-colors">
                  +66 00-000-0000
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 shrink-0 fac-green" />
                <a href="mailto:info@factoryartcentre.com" className="text-muted-foreground hover:text-primary transition-colors">
                  info@factoryartcentre.com
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-fac-green/20 bg-fac-green-dim p-6">
            <h3 className="mb-2 font-medium fac-green">การเดินทาง</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• BTS / MRT ลงสถานีใกล้เคียง</li>
              <li>• มีที่จอดรถบริเวณใกล้เคียง</li>
              <li>• รถสองแถว / มอเตอร์ไซค์รับจ้าง</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
