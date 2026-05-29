import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const DEFAULT_GALLERY = [
  "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=60",
  "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=600&q=60",
  "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=60",
  "https://images.unsplash.com/photo-1582878826629-29b7ad1cb43f?auto=format&fit=crop&w=600&q=60",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=60",
  "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=600&q=60",
  "https://images.unsplash.com/photo-1623689048105-a17b1e194011?auto=format&fit=crop&w=600&q=60",
  "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&q=60", 
  "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=600&q=60",
  "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=60",
  "https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?auto=format&fit=crop&w=600&q=60",
  "https://images.unsplash.com/photo-1548811579-017fc2a7f23e?auto=format&fit=crop&w=600&q=60",
];

const Gallery = () => {
  const { data: settings } = useSiteSettings();
  let row1: string[] = [];
  let row2: string[] = [];
  
  // Extract exactly 6 editable slots per row, preserving their explicit index keys.
  const extractRow = (source: any, defaultStart: number) => {
    const result = [];
    for (let i = 0; i < 6; i++) {
      let val = "";
      if (Array.isArray(source)) {
        val = source[i] || "";
      } else if (source && typeof source === 'object') {
        val = source[i.toString()] || "";
      }
      result.push(val || DEFAULT_GALLERY[(i + defaultStart) % DEFAULT_GALLERY.length]);
    }
    return result;
  };

  if (settings?.restaurant_info?.gallery?.row1 || settings?.restaurant_info?.gallery?.row2) {
    row1 = extractRow(settings.restaurant_info.gallery.row1, 0);
    row2 = extractRow(settings.restaurant_info.gallery.row2, 6);
  } else if (Array.isArray(settings?.restaurant_info?.gallery) && settings.restaurant_info.gallery.length > 0) {
    const gallery = settings.restaurant_info.gallery;
    const half = Math.ceil(gallery.length / 2);
    row1 = extractRow(gallery.slice(0, half), 0);
    row2 = extractRow(gallery.slice(half), 6);
  } else {
    row1 = extractRow(null, 0);
    row2 = extractRow(null, 6);
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothScroll = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  // Row 1 moves left (starts at 0%, moves to -15%)
  const x1 = useTransform(smoothScroll, [0, 1], ["0%", "-15%"]);
  // Row 2 moves right (starts at -15%, moves to 0%)
  const x2 = useTransform(smoothScroll, [0, 1], ["-15%", "0%"]);

  return (
    <section ref={containerRef} className="py-12 md:py-24 overflow-hidden bg-[#15191a]">
      <div className="flex flex-col gap-4 md:gap-6">
        <motion.div style={{ x: x1 }} className="flex gap-4 md:gap-6 w-max pl-4 md:pl-8">
          {[...row1, ...row1].map((url: string, i: number) => {
            const actualIndex = i % 6;
            return (
              <div key={`r1-${i}`} className="relative w-[60vw] md:w-[25vw] aspect-[4/3] vintage-frame overflow-hidden shrink-0 shadow-lg">
                <img src={url} alt={`Fampam Restaurant Berlin - Asiatische Küche und Atmosphäre ${actualIndex + 1}`} loading="lazy" decoding="async" data-edit-key={`gallery.row1.${actualIndex}`} className="w-full h-full object-cover filter saturate-[1.1] contrast-[1.05]" />
              </div>
            );
          })}
        </motion.div>
        
        <motion.div style={{ x: x2 }} className="flex gap-4 md:gap-6 w-max pl-4 md:pl-8">
          {[...row2, ...row2].map((url: string, i: number) => {
            const actualIndex = i % 6;
            return (
              <div key={`r2-${i}`} className="relative w-[60vw] md:w-[25vw] aspect-[4/3] vintage-frame overflow-hidden shrink-0 shadow-lg">
                <img src={url} alt={`Fampam Restaurant Berlin - Asiatische Küche und Atmosphäre ${actualIndex + 6}`} loading="lazy" decoding="async" data-edit-key={`gallery.row2.${actualIndex}`} className="w-full h-full object-cover filter saturate-[1.1] contrast-[1.05]" />
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;
