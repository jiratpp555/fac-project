import { createClient } from "@/lib/supabase/server";
import { GalleryImage } from "@/lib/types";
import Image from "next/image";

export const metadata = { title: "บรรยากาศภายใน Studio — FAC" };

export default async function StudioPage() {
  const supabase = await createClient();
  const { data: images } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  const gallery = (images ?? []) as GalleryImage[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold">
          บรรยากาศภายใน <span className="fac-green fac-glow">Studio</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          พื้นที่สร้างสรรค์ที่ออกแบบมาเพื่อแรงบันดาลใจ
        </p>
      </div>

      {gallery.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-xl border border-white/10 bg-card animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {gallery.map((img) => (
            <div key={img.id} className="mb-4 break-inside-avoid overflow-hidden rounded-xl border border-white/10 group">
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={img.image_url}
                  alt={img.caption ?? "Studio gallery"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {img.caption && (
                <p className="px-3 py-2 text-xs text-muted-foreground">{img.caption}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
