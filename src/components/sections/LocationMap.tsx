import { useT } from "@/i18n/LanguageProvider";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const LocationMap = () => {
  const { t } = useT();
  const { data: settings } = useSiteSettings();
  const info = settings?.restaurant_info || {
    name: "Nhà",
    address: "42 Lò Đúc Lane, Saigon",
  };

  const mapQuery = encodeURIComponent(`${info.name} ${info.address}`);

  return (
    <section id="location" className="relative border-t border-border/15 bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <span className="label-kicker text-muted-foreground">Find Us</span>
          <h2 className="mt-2 font-serif-display text-4xl">Our Location</h2>
        </div>
        
        <div className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-border/15 shadow-sm">
          <div className="relative h-[400px] w-full bg-surface">
            <iframe
              title={`${info.name} Location`}
              src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(100%) invert(90%) contrast(1.2)" }}
              allowFullScreen={false}
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
