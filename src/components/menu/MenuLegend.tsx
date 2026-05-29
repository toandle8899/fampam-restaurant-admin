import { DietaryBadge, SpiceIcons } from "./DietaryIcons";
import { Leaf } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";
import { StringKey } from "@/i18n/translations";

const MenuLegend = () => {
  const { t } = useT();
  
  const items: { code: "V" | "VV" | "G" | "NF" | "SF"; label: StringKey }[] = [
    { code: "V", label: "legend.veg" },
    { code: "VV", label: "legend.vegan" },
    { code: "G", label: "legend.gf" },
    { code: "NF", label: "legend.nf" },
    { code: "SF", label: "legend.sf" },
  ];

  return (
    <aside
      aria-label="Menu legend"
      className="hairline-t mt-12 grid gap-6 px-2 py-8 text-sm text-muted-foreground md:grid-cols-[1fr_auto]"
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {items.map((i) => (
            <span key={i.code} className="inline-flex items-center gap-2">
              <DietaryBadge code={i.code} />
              <span data-edit-key={"i18n." + i.label}>= {t(i.label)}</span>
            </span>
          ))}
          <span className="inline-flex items-center gap-2">
            <Leaf className="h-4 w-4 text-emerald" strokeWidth={2.5} />
            <span data-edit-key="i18n.legend.vegan">= {t("legend.vegan")}</span>
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 md:items-end">
        <span data-edit-key="i18n.legend.spice" className="label-kicker text-destructive">{t("legend.spice")}</span>
        <div className="flex items-center gap-4 font-mono-data text-xs">
          <span className="inline-flex items-center gap-1.5"><span data-edit-key="i18n.legend.hot">{t("legend.hot")}</span><SpiceIcons level={1} /></span>
          <span className="inline-flex items-center gap-1.5"><span data-edit-key="i18n.legend.hotter">{t("legend.hotter")}</span><SpiceIcons level={2} /></span>
          <span className="inline-flex items-center gap-1.5"><span data-edit-key="i18n.legend.hottest">{t("legend.hottest")}</span><SpiceIcons level={3} /></span>
        </div>
      </div>
    </aside>
  );
};

export default MenuLegend;