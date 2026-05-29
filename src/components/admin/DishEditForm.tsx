import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { DbDish } from "@/hooks/useMenu";

export const DIETARY_OPTIONS = [
  { code: "V", label: "Vegetarian (VG)" },
  { code: "VV", label: "Vegan (V)" },
  { code: "G", label: "Gluten-Free (GF)" },
  { code: "NF", label: "Nut-Free (NF)" },
  { code: "SF", label: "Shellfish-Free (SF)" },
];

export type EditingDish = Partial<DbDish> & { 
  showImage?: boolean; 
  image?: string; 
  translations?: any; 
  has_variants?: boolean; 
  variants?: any[]; 
};

interface DishEditFormProps {
  editingDish: EditingDish;
  setEditingDish: (dish: EditingDish) => void;
  collections: { id: string; label: string }[];
  onSave: (e: React.FormEvent) => void;
  onCancel?: () => void;
}

const PriceInput = ({ valueCents, onChange }: { valueCents: number, onChange: (cents: number) => void }) => {
  const [localVal, setLocalVal] = React.useState((valueCents / 100).toFixed(2));
  
  React.useEffect(() => {
    const clean = localVal.replace(/[^0-9.,]/g, "").replace(",", ".");
    if (Math.round(parseFloat(clean || "0") * 100) !== valueCents) {
      setLocalVal((valueCents / 100).toFixed(2));
    }
  }, [valueCents]);

  const handleBlur = () => {
    let clean = localVal.replace(/[^0-9.,]/g, "").replace(",", ".");
    const parsed = parseFloat(clean);
    if (!isNaN(parsed)) {
      const cents = Math.round(parsed * 100);
      onChange(cents);
      setLocalVal((cents / 100).toFixed(2));
    } else {
      onChange(0);
      setLocalVal("0.00");
    }
  };

  return (
    <Input
      type="text"
      value={localVal}
      onChange={e => setLocalVal(e.target.value)}
      onBlur={handleBlur}
      className="bg-background focus-visible:ring-emerald w-full h-8 text-sm md:h-10 md:text-base"
      placeholder="e.g. 11.90"
    />
  );
};

export const DishEditForm: React.FC<DishEditFormProps> = ({
  editingDish,
  setEditingDish,
  collections,
  onSave,
  onCancel
}) => {
  const toggleDietary = (code: string) => {
    const current = Array.isArray(editingDish.dietary) ? [...editingDish.dietary] : [];
    if (current.includes(code)) {
      setEditingDish({ ...editingDish, dietary: current.filter(c => c !== code) });
    } else {
      setEditingDish({ ...editingDish, dietary: [...current, code] });
    }
  };

  const updateTranslation = (lang: string, field: "name" | "description", value: string) => {
    const trans = editingDish.translations || {};
    const langData = trans[lang] || {};
    setEditingDish({
      ...editingDish,
      translations: {
        ...trans,
        [lang]: {
          ...langData,
          [field]: value
        }
      }
    });
  };

  return (
    <form onSubmit={onSave} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Code (e.g. M01)</Label>
          <Input value={editingDish?.code || ""} onChange={e => setEditingDish({...editingDish, code: e.target.value})} required />
        </div>
        <div className="space-y-2">
          <Label>Name (EN)</Label>
          <Input value={editingDish?.name || ""} onChange={e => setEditingDish({...editingDish, name: e.target.value})} required />
        </div>
        
        <div className="grid gap-2 col-span-2">
          <Label>Description (EN)</Label>
          <textarea
            value={editingDish?.description || ""}
            onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
            className="w-full bg-background border border-border/30 rounded-md p-2 min-h-[80px]"
          />
        </div>
        
        <div className="space-y-2 col-span-2 border-t pt-4 mt-2">
          <Label className="text-muted-foreground font-mono-data tracking-wider">Translations</Label>
        </div>
        
        <div className="space-y-2">
          <Label>Name (VI)</Label>
          <Input value={editingDish?.translations?.vi?.name || ""} onChange={e => updateTranslation("vi", "name", e.target.value)} placeholder="Tên món..." />
        </div>
        <div className="space-y-2">
          <Label>Description (VI)</Label>
          <Input value={editingDish?.translations?.vi?.description || ""} onChange={e => updateTranslation("vi", "description", e.target.value)} placeholder="Mô tả..." />
        </div>
        
        <div className="space-y-2">
          <Label>Name (PL)</Label>
          <Input value={editingDish?.translations?.pl?.name || ""} onChange={e => updateTranslation("pl", "name", e.target.value)} placeholder="Nazwa..." />
        </div>
        <div className="space-y-2">
          <Label>Description (PL)</Label>
          <Input value={editingDish?.translations?.pl?.description || ""} onChange={e => updateTranslation("pl", "description", e.target.value)} placeholder="Opis..." />
        </div>

        <div className="space-y-2">
          <Label>Name (DE)</Label>
          <Input value={editingDish?.translations?.de?.name || ""} onChange={e => updateTranslation("de", "name", e.target.value)} placeholder="Name..." />
        </div>
        <div className="space-y-2">
          <Label>Description (DE)</Label>
          <Input value={editingDish?.translations?.de?.description || ""} onChange={e => updateTranslation("de", "description", e.target.value)} placeholder="Beschreibung..." />
        </div>
      
        <div className="flex items-center gap-2 my-2 bg-emerald/10 p-3 rounded-md border border-emerald/20 col-span-2">
          <input
            type="checkbox"
            id="has_variants"
            checked={editingDish?.has_variants || false}
            onChange={(e) => {
              const hasVars = e.target.checked;
              setEditingDish({
                ...editingDish,
                has_variants: hasVars,
                variants: hasVars ? (editingDish?.variants?.length ? editingDish.variants : [{ id: crypto.randomUUID(), name: "", price_cents: 0 }]) : []
              });
            }}
            className="w-4 h-4 accent-emerald"
          />
          <Label htmlFor="has_variants" className="text-emerald font-bold">Enable Variants Mode</Label>
        </div>

        {!editingDish?.has_variants ? (
          <div className="grid gap-2 col-span-2">
            <Label>Price (e.g. 11.90)</Label>
            <PriceInput
              valueCents={editingDish?.price_cents || 0}
              onChange={(cents) => setEditingDish({ ...editingDish, price_cents: cents })}
            />
          </div>
        ) : (
          <div className="space-y-4 border border-border/30 p-4 rounded-md bg-background/50 col-span-2">
            <Label className="text-emerald">Variants</Label>
            {(editingDish?.variants || []).map((v, i) => (
              <div key={v.id} className="grid gap-3 p-3 border border-border/20 rounded-md relative bg-background">
                <button
                  type="button"
                  onClick={() => {
                    const newVars = [...(editingDish?.variants || [])];
                    newVars.splice(i, 1);
                    setEditingDish({ ...editingDish, variants: newVars });
                  }}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-400 text-xs"
                >
                  Remove
                </button>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Variant Name (EN)</Label>
                    <Input
                      value={v.name || ""}
                      onChange={(e) => {
                        const newVars = [...(editingDish?.variants || [])];
                        newVars[i].name = e.target.value;
                        setEditingDish({ ...editingDish, variants: newVars });
                      }}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Price (e.g. 11.90)</Label>
                    <PriceInput
                      valueCents={v.price_cents || 0}
                      onChange={(cents) => {
                        const newVars = [...(editingDish?.variants || [])];
                        newVars[i].price_cents = cents;
                        setEditingDish({ ...editingDish, variants: newVars });
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["vi", "pl", "de"].map(lang => (
                    <div key={lang} className="space-y-1">
                      <Label className="text-xs">Name ({lang.toUpperCase()})</Label>
                      <Input
                        value={v[`name_${lang}`] || ""}
                        onChange={(e) => {
                          const newVars = [...(editingDish?.variants || [])];
                          newVars[i][`name_${lang}`] = e.target.value;
                          setEditingDish({ ...editingDish, variants: newVars });
                        }}
                        className="h-8 text-xs"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Variant Metadata */}
                <div className="mt-2 pt-2 border-t border-border/20">
                  <Label className="text-xs text-emerald mb-2 block">Variant Metadata & Tags</Label>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {DIETARY_OPTIONS.map((opt) => {
                      const isSelected = Array.isArray(v.dietary) && v.dietary.includes(opt.code);
                      return (
                        <div key={opt.code} className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            id={`var-${i}-dietary-${opt.code}`}
                            checked={isSelected}
                            onChange={() => {
                              const newVars = [...(editingDish?.variants || [])];
                              const current = Array.isArray(newVars[i].dietary) ? [...newVars[i].dietary!] : [];
                              if (isSelected) {
                                newVars[i].dietary = current.filter(c => c !== opt.code);
                              } else {
                                newVars[i].dietary = [...current, opt.code];
                              }
                              setEditingDish({ ...editingDish, variants: newVars });
                            }}
                            className="w-3 h-3 rounded border-border/30 accent-emerald"
                          />
                          <Label htmlFor={`var-${i}-dietary-${opt.code}`} className="text-[10px] font-normal cursor-pointer leading-none">
                            {opt.label}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        id={`var-${i}-seasonal`}
                        checked={v.seasonal || false}
                        onChange={(e) => {
                          const newVars = [...(editingDish?.variants || [])];
                          newVars[i].seasonal = e.target.checked;
                          setEditingDish({ ...editingDish, variants: newVars });
                        }}
                        className="w-3 h-3 rounded border-border/30 accent-emerald"
                      />
                      <Label htmlFor={`var-${i}-seasonal`} className="text-[10px] font-normal cursor-pointer">Seasonal</Label>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        id={`var-${i}-shared`}
                        checked={v.shared_grill || false}
                        onChange={(e) => {
                          const newVars = [...(editingDish?.variants || [])];
                          newVars[i].shared_grill = e.target.checked;
                          setEditingDish({ ...editingDish, variants: newVars });
                        }}
                        className="w-3 h-3 rounded border-border/30 accent-emerald"
                      />
                      <Label htmlFor={`var-${i}-shared`} className="text-[10px] font-normal cursor-pointer">Shared Grill</Label>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        id={`var-${i}-raw`}
                        checked={v.raw_warning || false}
                        onChange={(e) => {
                          const newVars = [...(editingDish?.variants || [])];
                          newVars[i].raw_warning = e.target.checked;
                          setEditingDish({ ...editingDish, variants: newVars });
                        }}
                        className="w-3 h-3 rounded border-border/30 accent-emerald"
                      />
                      <Label htmlFor={`var-${i}-raw`} className="text-[10px] font-normal cursor-pointer">Raw Warn</Label>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor={`var-${i}-spice`} className="text-[10px] font-normal">Spice (0-3)</Label>
                    <Input
                      id={`var-${i}-spice`}
                      type="number"
                      min="0"
                      max="3"
                      value={v.spice_level || 0}
                      onChange={(e) => {
                        const newVars = [...(editingDish?.variants || [])];
                        newVars[i].spice_level = parseInt(e.target.value) || 0;
                        setEditingDish({ ...editingDish, variants: newVars });
                      }}
                      className="w-16 h-6 text-xs bg-background"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingDish({
                ...editingDish,
                variants: [...(editingDish?.variants || []), { id: crypto.randomUUID(), name: "", price_cents: 0 }]
              })}
              className="w-full text-xs"
            >
              + Add Variant
            </Button>
          </div>
        )}

        <div className="space-y-4 col-span-2 border border-border/30 p-4 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <input 
              type="checkbox" 
              id="showImage"
              checked={editingDish?.showImage || false}
              onChange={e => setEditingDish({...editingDish, showImage: e.target.checked})}
              className="w-4 h-4 rounded border-border/30 accent-emerald"
            />
            <Label htmlFor="showImage">Show Image</Label>
          </div>
          {editingDish?.showImage && (
            <div className="space-y-2 mt-2">
              <Label>Image URL (16:9 or 1:1 recommended)</Label>
              <p className="text-xs text-emerald mb-2 bg-emerald/10 p-2 rounded-md border border-emerald/20">
                <strong>Recommended Image Specs:</strong> Ratio: 16:9 (Landscape) or 1:1 (Square). Size: under 300KB.
              </p>
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="https://..." 
                  value={editingDish?.image || ""} 
                  onChange={e => setEditingDish({...editingDish, image: e.target.value})} 
                  onPaste={async (e) => {
                    const items = e.clipboardData?.items;
                    if (!items) return;
                    for (let i = 0; i < items.length; i++) {
                      if (items[i].type.indexOf("image") !== -1) {
                        e.preventDefault();
                        const file = items[i].getAsFile();
                        if (file) {
                          try {
                            const { uploadFileToR2 } = await import("@/components/ui/ImageUpload");
                            const url = await uploadFileToR2(file);
                            setEditingDish({...editingDish, image: url});
                          } catch (err: any) {
                            alert("Failed to upload pasted image: " + err.message);
                          }
                        }
                        break;
                      }
                    }
                  }}
                />
                <ImageUpload onUpload={(url) => setEditingDish({...editingDish, image: url})} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Leave empty to use a random default Asian food image.</p>
            </div>
          )}
        </div>

        <div className="space-y-4 col-span-2 border border-border/30 p-4 rounded-md">
          <Label className="text-emerald">Tags & Metadata</Label>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {DIETARY_OPTIONS.map((opt) => {
              const isSelected = Array.isArray(editingDish?.dietary) && editingDish?.dietary.includes(opt.code);
              return (
                <div key={opt.code} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`dietary-${opt.code}`}
                    checked={isSelected}
                    onChange={() => toggleDietary(opt.code)}
                    className="w-4 h-4 rounded border-border/30 accent-emerald"
                  />
                  <Label htmlFor={`dietary-${opt.code}`} className="text-sm font-normal cursor-pointer">
                    {opt.label}
                  </Label>
                </div>
              );
            })}
          </div>

          <hr className="border-border/15 my-4" />

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="seasonal"
                checked={editingDish?.seasonal || false}
                onChange={e => setEditingDish({...editingDish, seasonal: e.target.checked})}
                className="w-4 h-4 rounded border-border/30 accent-emerald"
              />
              <Label htmlFor="seasonal" className="text-sm font-normal cursor-pointer">Seasonal Item</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="shared_grill"
                checked={editingDish?.shared_grill || false}
                onChange={e => setEditingDish({...editingDish, shared_grill: e.target.checked})}
                className="w-4 h-4 rounded border-border/30 accent-emerald"
              />
              <Label htmlFor="shared_grill" className="text-sm font-normal cursor-pointer">Shared Grill Warning</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="raw_warning"
                checked={editingDish?.raw_warning || false}
                onChange={e => setEditingDish({...editingDish, raw_warning: e.target.checked})}
                className="w-4 h-4 rounded border-border/30 accent-emerald"
              />
              <Label htmlFor="raw_warning" className="text-sm font-normal cursor-pointer">Raw Meat/Fish Warning</Label>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <Label htmlFor="spice_level" className="text-sm font-normal">Spice Level (0-3)</Label>
            <Input
              id="spice_level"
              type="number"
              min="0"
              max="3"
              value={editingDish?.spice_level || 0}
              onChange={e => setEditingDish({...editingDish, spice_level: parseInt(e.target.value) || 0})}
              className="w-20 bg-background"
            />
          </div>
        </div>

        <div className="space-y-2 col-span-2">
          <Label>Collection</Label>
          <select
            className="flex h-10 w-full rounded-md border border-border/15 bg-background px-3 py-2 text-sm outline-none focus:border-emerald"
            value={editingDish?.collection_id || ""}
            onChange={(e) => setEditingDish({ ...editingDish, collection_id: e.target.value })}
            required
          >
            <option value="" disabled>Select a collection</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="w-full sm:w-auto bg-emerald text-[#15191a] hover:bg-emerald/90">
          Save Dish
        </Button>
      </div>
    </form>
  );
};
