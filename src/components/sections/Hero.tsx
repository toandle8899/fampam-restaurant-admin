import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useSpring, animate, useMotionValue } from "framer-motion";
import { useT } from "@/i18n/LanguageProvider";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useViewport } from "@/hooks/useViewport";

const logoFampamRestaurant = "https://pub-8cce0d5378724856b211904c1b1c0277.r2.dev/logo-fampam-restaurant.png";

const Hero = () => {
  const { t } = useT();
  const { data: settings } = useSiteSettings();
  const { isMobile, isTablet, isSmallViewport } = useViewport();
  const isPhoneOrTablet = isMobile || isTablet;

  const defaultSlides = [
    { mediaType: "video", url: "https://pub-8cce0d5378724856b211904c1b1c0277.r2.dev/0k2kvo_1.mp4" },
  ];

  const slides = Array.isArray(settings?.hero?.slides) 
    ? settings.hero.slides 
    : (settings?.hero && settings.hero.url ? [settings.hero] : defaultSlides);

  const brand = settings?.brand || { name: t("hero.title.line1"), tagline: t("hero.title.line2") };
  let heroVideo = settings?.restaurant_info?.heroVideo;
  
  if (heroVideo) {
    if (heroVideo.includes('vimeo.com') && !heroVideo.includes('background=1')) {
      heroVideo += (heroVideo.includes('?') ? '&' : '?') + 'background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&playsinline=1';
    } else if (heroVideo.includes('youtube.com') && !heroVideo.includes('controls=0')) {
      heroVideo += (heroVideo.includes('?') ? '&' : '?') + 'controls=0&autoplay=1&mute=1&playsinline=1&loop=1';
    } else if (heroVideo.includes('streamable.com')) {
      const requiredParams = ['autoplay=1', 'muted=1', 'nocontrols=1', 'controls=0', 'fit=cover', 'playsinline=1'];
      requiredParams.forEach(param => {
        if (!heroVideo.includes(param.split('=')[0] + '=')) {
          heroVideo += (heroVideo.includes('?') ? '&' : '?') + param;
        }
      });
    }
  }

  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // Show logo fading in for 1s, hold for 0.5s, then exit
    const timer = setTimeout(() => {
      setIsAppLoading(false);
      // Trigger app-ready shortly after mask starts opening to fade in text and nav
      const readyTimer = setTimeout(() => {
        window.dispatchEvent(new Event('app-ready'));
      }, 500);
      
      return () => clearTimeout(readyTimer);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (heroVideo || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length, heroVideo]);

  const virtualProgress = useMotionValue(0);
  useEffect(() => {
    let unsubscribe: () => void;
    if (isPhoneOrTablet) {
      const controls = animate(virtualProgress, 1, { duration: 2, ease: "easeInOut", delay: 1.2 });
      unsubscribe = controls.stop;
    } else {
      unsubscribe = scrollYProgress.on("change", (latest) => virtualProgress.set(latest));
    }
    return () => unsubscribe?.();
  }, [isPhoneOrTablet, scrollYProgress, virtualProgress]);

  const smoothScroll = virtualProgress; // Bypass spring for instant 1:1 mapping

  const maskMaxScale = isMobile ? 18 : isTablet ? 24 : 35;
  const desktopHollowScale = 0.8;

  // Animate the entrance scale from 0 to 1
  const entranceScale = useMotionValue(0);
  useEffect(() => {
    animate(entranceScale, 1, { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 });
  }, []);

  const getHoleMask = (scale: number) => {
    const px = (x: number) => 50 + (x - 50) * scale;
    const py = (y: number) => 100 + (y - 100) * scale;
    const outer = `M -5000 -5000 H 5000 V 5000 H -5000 Z `;
    const hole = `M ${px(10)} ${py(100)} ` +
                 `V ${py(60)} ` +
                 `C ${px(15)} ${py(75)}, ${px(25)} ${py(40)}, ${px(30)} ${py(40)} ` +
                 `C ${px(40)} ${py(55)}, ${px(60)} ${py(55)}, ${px(70)} ${py(40)} ` +
                 `C ${px(75)} ${py(40)}, ${px(85)} ${py(75)}, ${px(90)} ${py(60)} ` +
                 `V ${py(100)} Z`;
    return outer + hole;
  };

  const dynamicPathMobile = useTransform(() => {
    const scrollProg = virtualProgress.get();
    const entrance = entranceScale.get();
    const scrollRatio = Math.min(Math.max(scrollProg / 0.8, 0), 1);
    const targetCurrentScale = 1 + scrollRatio * (maskMaxScale - 1);
    return getHoleMask(entrance * targetCurrentScale);
  });

  const dynamicPathDesktop = useTransform(() => {
    const scrollProg = virtualProgress.get();
    const entrance = entranceScale.get();
    const scrollRatio = Math.min(Math.max(scrollProg / 0.8, 0), 1);
    const targetCurrentScale = desktopHollowScale + scrollRatio * (maskMaxScale - desktopHollowScale);
    return getHoleMask(entrance * targetCurrentScale);
  });
  
  // Text moves up slightly and scales
  const initialTextY = isMobile ? -8 : -32; // -8 is 24px (1.5rem) lower than -32
  const textY = useTransform(smoothScroll, [0, 0.4], [initialTextY, -92]);
  const textScale = useTransform(smoothScroll, [0, 0.4], [1, 1.1]);

  const info = settings?.restaurant_info || {
    address: "42 Lò Đúc Lane, District 1",
    hours: [
      { day: "Everyday", hours: "11:00 - 22:00" }
    ]
  };

  return (
    <section
      id="top"
      ref={containerRef}
      aria-labelledby="hero-title"
      className={`relative isolate ${isPhoneOrTablet ? 'h-[100dvh]' : 'h-[150dvh]'} bg-[#171c14] text-paper`}
    >
      {/* Loading Screen Overlay - Just the logo, background is handled by the mask */}
      <AnimatePresence>
        {isAppLoading && (
          <motion.div
            key="hero-loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none bg-[#171c14]"
          >
              <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              src={logoFampamRestaurant}
              alt="Fampam Restaurant Logo - Vietnamesische Küche Berlin"
              className="w-auto h-20 sm:h-24 md:h-32 object-contain drop-shadow-xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky container holds the visual layout while we scroll through the 150vh height */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#171c14]">
        
        {/* Cinematic backdrop (always fills the screen) */}
        <div className="absolute inset-0 z-0 bg-[#171c14]" aria-hidden="true">
          {heroVideo ? (
            <>
              <div className="absolute inset-0 z-0 bg-black" aria-hidden="true" />
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                <iframe
                  src={heroVideo}
                  onLoad={() => setIsVideoLoaded(true)}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  className="absolute pointer-events-none"
                  style={{
                    border: "none",
                    top: "50%",
                    left: "50%",
                    width: "100vw",
                    height: "56.25vw",
                    minHeight: "100vh",
                    minWidth: "177.77vh",
                    transform: "translate(-50%, -50%) scale(1.1)",
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                  }}
                />
              </div>
            </>
          ) : (
            <AnimatePresence initial={false}>
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                {slides[currentSlide].mediaType === "video" ? (
                  <video
                    src={slides[currentSlide].url}
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    onLoadedData={() => setIsVideoLoaded(true)}
                  />
                ) : (
                  <img
                    src={slides[currentSlide].url}
                    alt="Fampam Restaurant Berlin - Neo-moderne Asiatische Küche Hintergrund"
                    className="h-full w-full object-cover"
                    onLoad={() => setIsVideoLoaded(true)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}
          {/* subtle dark green tint so text remains readable even when mask scales up */}
          <div className="absolute inset-0 z-10 bg-[#171c14]/40" />
        </div>

        {/* The SVG Arch Mask Overlay */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center">
          <div className="w-full h-full flex items-end justify-center">
            {/* Mobile Mask */}
            <svg
              viewBox="0 0 100 100"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 block h-[105dvh] w-[192dvw] sm:hidden"
              preserveAspectRatio="none"
            >
              <motion.path 
                fill="#171c14" 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d={dynamicPathMobile} 
              />
            </svg>
            {/* Desktop/Tablet Mask (Taller by 25%) */}
            <svg
              viewBox="0 0 100 100"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 hidden h-[131dvh] w-[110dvw] sm:w-[200dvw] lg:w-[110dvw] sm:block"
              preserveAspectRatio="none"
            >
              <motion.path 
                fill="#171c14" 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d={dynamicPathDesktop} 
              />
            </svg>
          </div>
        </div>

        <motion.div 
          className="container relative z-20 mx-auto flex h-full max-w-2xl flex-col items-center justify-center px-6 text-center"
          style={{ y: textY, scale: textScale }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isAppLoading ? 0 : 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Spacer so the text stays centered lower, pushed inside the mask */}
          <div className="h-[35vh] md:h-[45vh]" aria-hidden="true" />

          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="font-mono-data text-xs md:text-sm uppercase tracking-widest text-paper/90 space-y-2 max-w-md mx-auto">
              <a 
                href="https://maps.app.goo.gl/hZNA9iTrzKSfEp339"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold hover:text-emerald transition-colors block cursor-pointer"
                title="View on Google Maps"
              >
                @ {info.address}{info.address.includes('Berlin') ? '' : ', 10719 Berlin'}
              </a>
              <p data-edit-key="hero.slogan" className="italic lowercase tracking-normal text-paper/70 font-sans text-sm md:text-base mt-4 max-w-[250px] mx-auto md:max-w-none">
                {settings?.hero?.slogan || "Authentic Asian heritage, crafted with love in the heart of Berlin."}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="#reserve"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('reserve')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group inline-flex items-center gap-3 rounded-full bg-emerald px-8 py-4 text-[#15191a] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-[#171c14]"
              >
                <span data-edit-key="i18n.hero.cta.reserve" className="label-kicker font-serif-display font-black text-sm">{t("hero.cta.reserve")}</span>
              </a>
              <a
                href="#menu"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('menu-title')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="hairline inline-flex items-center gap-2 rounded-full border-paper/40 bg-transparent px-8 py-4 text-paper backdrop-blur-sm transition-colors hover:bg-paper/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-[#171c14]"
              >
                <span data-edit-key="i18n.hero.cta.menu" className="label-kicker font-serif-display font-black text-sm">{t("hero.cta.menu")}</span>
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
