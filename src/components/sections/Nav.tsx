import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import LanguageSwitch from "@/components/LanguageSwitch";
import { useT } from "@/i18n/LanguageProvider";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { animate, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useViewport } from "@/hooks/useViewport";

const logoFampamRestaurant = "https://pub-8cce0d5378724856b211904c1b1c0277.r2.dev/logo-fampam-restaurant.png";

const Nav = () => {
  const { t } = useT();
  const [time, setTime] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const { data: settings } = useSiteSettings();
  const { isMobile, isTablet } = useViewport();
  const info = settings?.restaurant_info || { name: "FamPam" };

  useEffect(() => {
    const handler = () => setIsAppReady(true);
    window.addEventListener('app-ready', handler);
    // fallback timeout just in case event is missed
    const t = setTimeout(() => setIsAppReady(true), 8000);
    return () => {
      window.removeEventListener('app-ready', handler);
      clearTimeout(t);
    };
  }, []);

  const { scrollY } = useScroll();
  const virtualScrollY = useMotionValue(0);
  
  useEffect(() => {
    let unsubscribe: () => void;
    if (isMobile || isTablet) {
      const controls = animate(virtualScrollY, 50, { duration: 2, ease: "easeInOut", delay: 1.2 });
      unsubscribe = controls.stop;
    } else {
      unsubscribe = scrollY.on("change", (latest) => virtualScrollY.set(latest));
    }
    return () => unsubscribe?.();
  }, [isMobile, isTablet, scrollY, virtualScrollY]);

  const smoothScroll = virtualScrollY; // Bypass spring for instant 1:1 mapping
  const headerTop = "0rem";
  const scale = useTransform(smoothScroll, [0, 300], [1, 0.95]);

  const initialLogoY = isMobile ? "7.5rem" : isTablet ? "8rem" : "6.5rem";
  const stickyLogoY = isMobile ? "-0.5rem" : isTablet ? "-0.4rem" : "-0.25rem";
  
  // Logo scales and moves quickly on first scroll, with a smaller tablet portrait baseline
  const initialScale = isMobile ? 2.58 : isTablet ? 2.625 : 2.75;
  const logoScale = useTransform(smoothScroll, [0, 50], [initialScale, 1.5]);
  const logoY = useTransform(smoothScroll, [0, 50], [initialLogoY, stickyLogoY]);
  const taglineOpacity = useTransform(smoothScroll, [0, 50], [1, 0]);
  const taglineHeight = useTransform(smoothScroll, [0, 50], ["auto", "0px"]);
  const initialTaglineMargin = isMobile ? "-0.25rem" : isTablet ? "-0.1rem" : "0rem";
  const taglineMargin = useTransform(smoothScroll, [0, 50], [initialTaglineMargin, "0rem"]);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(`${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`);
      
      const day = d.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
      const h = d.getHours();
      // Sat(6), Sun(0): 12:00–22:00
      // Mon(1), Tue(2), Wed(3), Thu(4), Fri(5): 11:00–22:00
      if (day === 0 || day === 6) {
        setIsOpen(h >= 12 && h < 22);
      } else {
        setIsOpen(h >= 11 && h < 22);
      }
    };
    tick();
    const i = setInterval(tick, 30_000);
    return () => clearInterval(i);
  }, []);

  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isPastHeroHalf, setIsPastHeroHalf] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate 50% of Hero section scroll trigger point
      const isPhoneOrTablet = window.innerWidth < 1024;
      const heroHeight = window.innerHeight * (isPhoneOrTablet ? 1.0 : 1.5);
      const halfHero = heroHeight * 0.5;
      setIsPastHeroHalf(window.scrollY >= halfHero);

      const menuEl = document.getElementById("menu");
      if (menuEl) {
        const rect = menuEl.getBoundingClientRect();
        // Hide nav when the section has scrolled up enough that
        // the filter sticky bar would be at (or near) the top of viewport.
        // rect.top <= 0 means the section top is at or above the viewport top.
        const inMenuZone = rect.top <= 0 && rect.bottom > 0;
        setIsNavVisible(!inMenuZone);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "#reserve", label: t("nav.reserve") },
    { href: "#delivery", label: t("nav.order") },
    { href: "#footer", label: t("footer.contact") },
  ];

  return (
    <motion.header 
      style={{ top: headerTop }} 
      animate={{ y: isNavVisible ? "0%" : "-110%", pointerEvents: isNavVisible ? "auto" : "none" }} 
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="fixed inset-x-0 z-50"
    >
      {/* Dark gradient overlay underneath to ensure text readability */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isPastHeroHalf ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/95 via-black/40 to-transparent pointer-events-none -z-10"
      />
      
      {/* Sticky header solid glass background */}
      <motion.div 
        initial={{ opacity: 0, y: "-100%" }}
        animate={{ 
          opacity: isPastHeroHalf ? 1 : 0, 
          y: isPastHeroHalf ? "0%" : "-100%" 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute inset-0 bg-background/95 backdrop-blur-md shadow-sm border-b border-white/5"
      />
      <motion.div 
        style={{ scale }} 
        initial={{ opacity: 0 }}
        animate={{ opacity: isAppReady ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 pt-2 pb-2 md:pt-4 md:pb-4 origin-top"
      >
        {/* Left Side: Nav Links */}
        <div className="flex flex-1 justify-start z-10">
          <nav
            aria-label="Primary"
            className="hairline hidden md:flex items-center gap-1 rounded-full bg-background/80 px-1 backdrop-blur-md md:px-2 h-[36px] md:h-[40px]"
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="label-kicker font-black flex h-full items-center justify-center rounded-full px-2 text-[10px] md:text-[11px] md:px-3 text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald pt-[2px]"
              >
                {l.label}
              </a>
            ))}
          </nav>
          
          <button 
            className="md:hidden flex items-center justify-center h-[36px] w-[36px] rounded-full bg-background/80 backdrop-blur-md border border-white/10 text-foreground"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Center: Logo */}
        <motion.div style={{ scale: logoScale, y: logoY }} className="flex flex-1 justify-center z-10 pointer-events-none md:pointer-events-auto origin-top">
          <a
            href="#top"
            className="flex flex-col items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald rounded p-2"
          >
            <img 
              src={logoFampamRestaurant} 
              alt={info.name} 
              className="h-9 sm:h-10 md:h-10 lg:h-11 w-auto object-contain drop-shadow-md" 
            />
            <motion.span 
              style={{ opacity: taglineOpacity, height: taglineHeight, marginTop: taglineMargin, overflow: 'hidden' }} 
              className="font-mono-data text-[7px] md:text-[8px] text-foreground/80 uppercase tracking-[0.2em] text-center leading-none origin-top block whitespace-nowrap"
            >
              <span data-edit-key="i18n.hero.subtitle">{settings?.brand?.subtitle || t("hero.subtitle")}</span>
            </motion.span>
          </a>
        </motion.div>

        {/* Right Side: Language & Time */}
        <div className="flex flex-1 justify-end items-center gap-2 z-10">
          <LanguageSwitch />
          <div
            className="hairline hidden items-center gap-2 rounded-full bg-background/80 pl-4 pr-3 backdrop-blur-md sm:flex h-[36px] md:h-[40px] pt-[2px]"
            aria-label={`${t("nav.open")} · ${time || "--:--"}`}
          >
              <span className={`label-kicker text-[10px] md:text-[11px] font-black leading-none ${isOpen ? "text-emerald" : "text-destructive"}`}>
                <span data-edit-key={isOpen ? "i18n.nav.open" : "i18n.nav.closed"}>{isOpen ? t("nav.open") : t("nav.closed")}</span>
              </span>
              <span className="label-kicker text-[10px] md:text-[11px] font-black leading-none text-muted-foreground">{time || "--:--"}</span>
            </div>
          </div>
        </motion.div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-[#15191a] p-6 flex flex-col items-center justify-center md:hidden"
          >
            <button 
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col gap-8 text-center font-serif-display text-4xl text-paper">
              {links.map(l => (
                <a 
                  key={l.href} 
                  href={l.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-emerald transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Nav;
