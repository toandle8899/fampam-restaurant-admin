import type { Dietary } from "@/data/dishMeta";
import { DietaryBadge, SpiceIcons } from "./DietaryIcons";

export interface MenuFilters {
  dietary: Set<Dietary>;
  seasonal?: boolean;
  spice: 0 | 1 | 2 | 3; // 0 = any
}

const dietaryChips: Dietary[] = ["V", "VV", "G", "NF", "SF"];

interface Props {
  filters: MenuFilters;
  onChange: (f: MenuFilters) => void;
}

const baseChip =
  "inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 min-h-[34px] font-mono-data text-[11px] uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald";

const FilterChips = ({ filters, onChange }: Props) => {
  const toggleDietary = (d: Dietary) => {
    const next = new Set(filters.dietary);
    next.has(d) ? next.delete(d) : next.add(d);
    onChange({ ...filters, dietary: next });
  };

  const setSpice = (lvl: 0 | 1 | 2 | 3) => {
    onChange({ ...filters, spice: filters.spice === lvl ? 0 : lvl });
  };

  const hasActive = filters.dietary.size > 0 || filters.spice > 0;

  const reset = () =>
    onChange({ dietary: new Set(), spice: 0 });

  return (
    <div className="flex w-full justify-start overflow-x-auto hide-scrollbar snap-x snap-mandatory items-center gap-2 md:justify-center md:flex-wrap md:px-0 scroll-pl-4 md:scroll-pl-0 pr-4 md:pr-0 py-1">
      <div className="w-4 shrink-0 md:hidden" aria-hidden="true" />
      {dietaryChips.map((d) => {
        const active = filters.dietary.has(d);
        const label = d === "V" ? "Vegetarian" : d === "VV" ? "Vegan" : d === "G" ? "Gluten-Free" : d === "NF" ? "Nut-Free" : "Shellfish-Free";
        return (
          <button
            key={d}
            type="button"
            aria-pressed={active}
            onClick={() => toggleDietary(d)}
            className={`${baseChip} shrink-0 snap-start ${active ? "border-foreground bg-foreground text-background [&_*]:!text-background" : "border-border/30 text-foreground/80 hover:bg-foreground/5"}`}
          >
            <DietaryBadge code={d} />
            <span className="font-mono-data text-[11px] uppercase tracking-wider hidden md:inline">{label}</span>
          </button>
        );
      })}



      {[1, 2, 3].map((n) => {
        const lvl = n as 1 | 2 | 3;
        const active = filters.spice === lvl;
        return (
          <button
            key={lvl}
            type="button"
            aria-pressed={active}
            aria-label={`Spice level ${lvl}`}
            onClick={() => setSpice(lvl)}
            className={`${baseChip} shrink-0 snap-start ${active ? "border-destructive bg-destructive/15 text-destructive" : "border-border/30 text-foreground/80 hover:bg-foreground/5"}`}
          >
            <SpiceIcons level={lvl} />
          </button>
        );
      })}

      {hasActive && (
        <button
          type="button"
          onClick={reset}
          className="ml-2 shrink-0 font-mono-data text-[11px] text-muted-foreground underline underline-offset-4 hover:text-foreground pr-4 md:pr-0"
        >
          clear
        </button>
      )}
    </div>
  );
};

export default FilterChips;