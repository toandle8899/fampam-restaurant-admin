import { useRef, lazy, Suspense } from "react";
import { useT } from "@/i18n/LanguageProvider";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useInView } from "framer-motion";

const FooterStickers = lazy(() => import("./FooterStickers").then(m => ({ default: m.FooterStickers })));

const Footer = () => {
  const { t } = useT();
  const { data: settings } = useSiteSettings();
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.1 });
  
  const info = settings?.restaurant_info || {
    name: "Nhà",
    address: "42 Lò Đúc Lane, District 1, Saigon · 700000",
    phone: "+84 28 0000 0000",
    website: "hello@nha.kitchen",
    hours: [
      { day: "Everyday", hours: "11:00 - 22:00" }
    ],
    socials: {
      instagram: "#",
      facebook: "#"
    }
  };

  return (
    <footer id="footer" ref={footerRef} className="hairline-t bg-background relative overflow-hidden">
      {isInView && (
        <Suspense fallback={null}>
          <FooterStickers />
        </Suspense>
      )}
      <div className="container mx-auto px-4 pt-14 pb-56 text-center md:pt-16 md:pb-64 relative z-10 pointer-events-none">
        <div className="flex flex-col items-start max-w-6xl mx-auto">
          <div className="flex items-baseline gap-2">
            <h2 data-edit-key="i18n.footer.contact" className="font-serif-display text-5xl pointer-events-auto">{t("footer.contact")}</h2>
          </div>
        </div>

        {/* New 2-column layout for Map and Info */}
        <div className="mx-auto mt-16 grid max-w-6xl gap-12 text-left md:grid-cols-2 items-center pointer-events-auto">
          
          {/* Column 1: Info (Address, Hours, Contact) */}
          <div className="flex flex-col gap-8">
            <div className="font-mono-data text-sm">
              <div className="label-kicker mb-3 text-muted-foreground">Online</div>
              <a
                href="https://business.google.com/v/_/010629449928627232736/fe26/_/fullmenu/?gclid=CjwKCAiA5sieBhBnEiwAR9oh2kSF2o8Au7zeZResjXQEkRGdRJi5sPcncgHbzFqOoEIB2VEexIIf4RoCrB8QAvD_BwE&caid=19186525882&agid=145053874795"
                target="_blank"
                rel="noopener noreferrer"
                data-edit-key="restaurant_info.website"
                data-edit-attr="href"
                className="block text-foreground/90 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:underline pointer-events-auto"
              >
                {info.website.replace("https://", "").replace("http://", "")}
              </a>
              <a href={`tel:${info.phone}`} data-edit-key="restaurant_info.phone" className="mt-2 block text-muted-foreground hover:text-foreground pointer-events-auto">
                {info.phone}
              </a>
              <div className="mt-6 flex flex-wrap gap-2 pointer-events-auto">
                {Object.entries({
                  ...info.socials,
                  facebook: info.socials?.facebook && info.socials.facebook !== "#" ? info.socials.facebook : "https://www.facebook.com/FamPamrestaurant/"
                }).map(([key, url]) => (
                  url && url !== "#" && (
                    <a
                      key={key}
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-edit-key={`restaurant_info.socials.${key}`}
                      data-edit-attr="href"
                      className="hairline rounded-full px-3 py-1 text-[11px] uppercase text-foreground/80 transition-colors hover:bg-foreground/5"
                    >
                      {key}
                    </a>
                  )
                ))}
              </div>
            </div>

            <div className="font-mono-data text-sm">
              <div data-edit-key="i18n.footer.visit" className="label-kicker mb-3 text-muted-foreground">{t("footer.visit")}</div>
              <p data-edit-key="restaurant_info.address" className="not-italic text-foreground/90 whitespace-pre-line pointer-events-auto">
                {info.address.split(", ").join("\n")}
              </p>
              <div className="mt-4 text-muted-foreground">
                {info.hours.map((h: any, i: number) => {
                  const isTime = /\d/.test(h.hours);
                  const formattedHours = isTime 
                    ? h.hours.replace(/\s*(uhr|h)\s*$/i, '').trim() + ' h' 
                    : h.hours;
                  
                  return (
                    <div key={i} className="flex justify-between gap-4 max-w-[280px] mb-1">
                      <span className="shrink-0">{h.day}</span>
                      <span className="text-amber text-right">{formattedHours}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 2: Map */}
          <div className="w-full overflow-hidden rounded-lg border border-border/15 shadow-sm">
            <div className="relative h-[250px] md:h-[320px] w-full bg-surface">
              <iframe
                title={`${info.name} Location`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(`${info.name} ${info.address}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(100%) invert(90%) contrast(1.2)" }}
                allowFullScreen={false}
                loading="lazy"
              ></iframe>
            </div>
          </div>

        </div>
      </div>

      <div className="hairline-t relative z-10 pointer-events-none">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-4 font-mono-data text-[11px] text-muted-foreground">
          <span className="pointer-events-auto">© {new Date().getFullYear()} · {info.name}</span>
          <a href="https://toandle.webflow.io/" target="_blank" rel="noopener noreferrer" className="pointer-events-auto underline underline-offset-4 hover:text-foreground transition-colors">
            made by @toandle
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
