import { useT } from "@/i18n/LanguageProvider";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Delivery = () => {
  const { t } = useT();
  const { data: settings } = useSiteSettings();

  const links = [
    {
      name: "UberEats",
      url: "https://www.ubereats.com/de/store/fampam-asiatische-kuche-%26-sushibar/ZGwHGiweQ5-9dcLw3OqNvQ",
      color: "hover:text-[#06C167]"
    },
    {
      name: "Wolt",
      url: "https://wolt.com/de/deu/berlin/restaurant/fam-pam-asiatische-kche-sushibar",
      color: "hover:text-[#009de0]"
    },
    {
      name: "Lieferando",
      url: "https://www.lieferando.de/speisekarte/fam-pam-restaurant",
      color: "hover:text-[#FF8000]"
    },
    {
      name: "DISH",
      url: "https://fam-pam-restaurant-berlin.eatbu.com/?lang=en",
      color: "hover:text-emerald"
    }
  ];

  return (
    <section id="delivery" className="border-t border-border/15 bg-background py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 data-edit-key="i18n.delivery.title" className="font-serif-display text-2xl mb-4 pointer-events-auto">
            {settings?.restaurant_info?.delivery?.title || t("delivery.title")}
          </h2>
          <p data-edit-key="i18n.delivery.subtitle" className="font-mono-data text-xs text-muted-foreground mb-12 uppercase tracking-widest pointer-events-auto">
            {settings?.restaurant_info?.delivery?.subtitle || t("delivery.subtitle")}
          </p>
        </motion.div>
        
        <div className="flex flex-col items-center justify-center gap-6 md:gap-8">
          {links.map((link, i) => (
            <motion.a
              key={link.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-serif-display text-5xl md:text-7xl transition-colors duration-300 text-foreground ${link.color}`}
            >
              @{link.name}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Delivery;
