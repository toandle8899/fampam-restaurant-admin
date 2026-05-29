import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { X } from "lucide-react";

const Promotion = () => {
  const { data: settings } = useSiteSettings();
  const [isOpen, setIsOpen] = useState(false);
  
  // Default placeholder if none is set in CMS
  const bannerUrl = settings?.restaurant_info?.promotion?.banner || "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=1200&q=80";

  return (
    <section className="relative bg-[#15191a] py-12 md:py-16">
      <div className="container mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full overflow-hidden vintage-frame cursor-pointer group rounded-b-none"
          onClick={() => setIsOpen(true)}
        >
          {/* Subtle background glow */}
          <div className="absolute left-1/2 top-1/2 -z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-emerald/10 blur-[80px]" />
          
          <img 
            src={bannerUrl} 
            alt="Aktuelle Angebote und Specials - Fampam Restaurant Berlin" 
            className="w-full aspect-[16/9] object-cover transition-transform duration-700 group-hover:scale-105 filter saturate-[1.1] contrast-[1.05]"
            data-edit-key="promotion.banner"
            data-edit-attr="src"
          />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
            onClick={() => setIsOpen(false)}
          >
            <button 
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              src={bannerUrl}
              alt="Aktuelle Angebote und Specials Vollbild - Fampam Restaurant Berlin"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Promotion;
