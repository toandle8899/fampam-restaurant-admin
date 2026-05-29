import { useEffect, useRef, useState } from "react";
import { LANGS } from "@/i18n/translations";
import { useT } from "@/i18n/LanguageProvider";

const LanguageSwitch = () => {
  const { lang, setLang, t } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("nav.lang")}
        onClick={() => setOpen((v) => !v)}
        className="hairline flex items-center justify-center gap-1.5 rounded-full bg-background/80 pl-4 pr-3 h-[36px] md:h-[40px] label-kicker font-black text-[10px] md:text-[11px] text-foreground pt-[2px] leading-none backdrop-blur-md transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
      >
        <span>{current.label}</span>
        <span aria-hidden="true" className="text-foreground/50">▾</span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("nav.lang")}
          className="hairline animate-fade-up absolute right-0 top-full z-50 mt-2 min-w-[10rem] overflow-hidden rounded-md bg-background/95 p-1 backdrop-blur-md shadow-lg"
        >
          {LANGS.map((l) => {
            const active = l.code === lang;
            return (
              <li key={l.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setLang(l.code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded px-3 pb-2 pt-[10px] text-left label-kicker font-black text-[10px] md:text-[11px] leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald ${
                    active
                      ? "bg-foreground/5 text-foreground"
                      : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-6">{l.label}</span>
                    <span className="text-foreground/60">{l.full}</span>
                  </span>
                  {active && <span className="text-emerald" aria-hidden="true">●</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitch;
