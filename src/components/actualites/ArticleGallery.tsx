"use client";

import Image from "next/image";
import { useState } from "react";
import type { Media } from "@/content/types";
import Lightbox from "@/components/Lightbox";

export default function ArticleGallery({ items, label }: { items: Media[]; label: string }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {items.map((m, i) => (
          <li key={m.src}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Agrandir : ${m.caption ?? m.alt}`}
              className="group relative block aspect-[4/3] w-full overflow-hidden bg-ivoire"
            >
              <Image src={m.src} alt={m.alt} fill sizes="(min-width: 768px) 50vw, 83vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </button>
            <p className="mt-2 text-[12px] text-encre/60">{m.caption ?? m.alt}</p>
          </li>
        ))}
      </ul>
      <Lightbox items={items} index={open} label={label} onClose={() => setOpen(null)} />
    </>
  );
}
