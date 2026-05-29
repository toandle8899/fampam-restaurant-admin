import type { Dietary } from "@/data/dishMeta";
import { Flame, Leaf, Wheat, NutOff, FishOff, Carrot, Sun } from "lucide-react";

export const DietaryBadge = ({ code, showLabel = false }: { code: Dietary, showLabel?: boolean }) => {
  const getInitials = (code: Dietary) => {
    switch (code) {
      case "V": return "VG"; // Vegetarian
      case "VV": return "V"; // Vegan
      case "G": return "GF"; // Gluten-Free
      case "NF": return "NF"; // Nut-Free
      case "SF": return "SF"; // Shellfish-Free
      default: return code;
    }
  };

  const getLabel = (code: Dietary) => {
    switch (code) {
      case "V": return "Vegetarian";
      case "VV": return "Vegan";
      case "G": return "Gluten-Free";
      case "NF": return "Nut-Free";
      case "SF": return "Shellfish-Free";
      default: return code;
    }
  };

  return (
    <span className="inline-flex items-center gap-1.5 mix-blend-normal">
      <span className="font-mono-data text-[11px] font-bold tracking-widest text-emerald/80">{getInitials(code)}</span>
      {showLabel && <span className="font-mono-data text-[11px] uppercase tracking-wider text-muted-foreground">{getLabel(code)}</span>}
    </span>
  );
};

export const SpiceIcons = ({ level }: { level: 1 | 2 | 3 }) => (
  <span className="inline-flex items-center gap-0.5 text-destructive" aria-label={`Spice level ${level}`}>
    {Array.from({ length: level }).map((_, i) => (
      <Flame key={i} className="h-3.5 w-3.5" strokeWidth={2.2} />
    ))}
  </span>
);

export const Footnote = ({ symbol, title }: { symbol: "+" | "*"; title: string }) => (
  <sup title={title} className="font-mono-data text-[11px] text-amber">{symbol}</sup>
);