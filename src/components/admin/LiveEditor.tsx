import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/LanguageProvider";
import { queryClient } from "@/App";
import { DishEditForm, EditingDish } from "./DishEditForm";

export const useEditMode = () => {
  const [searchParams] = useSearchParams();
  return searchParams.get("edit") === "true";
};

const LiveEditor = () => {
  const isEditing = useEditMode();
  const { lang } = useT();
  const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editKey, setEditKey] = useState("");
  const [editAttr, setEditAttr] = useState("");
  
  const [editingDishObj, setEditingDishObj] = useState<EditingDish | null>(null);
  const [menuCollections, setMenuCollections] = useState<any[]>([]);

  useEffect(() => {
    if (!isEditing) return;

    const handleMouseOver = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest || typeof (e.target as HTMLElement).closest !== 'function') return;
      const target = (e.target as HTMLElement).closest("[data-edit-key]");
      if (target) {
        (target as HTMLElement).style.outline = "2px dashed #10b981";
        (target as HTMLElement).style.cursor = "pointer";
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest || typeof (e.target as HTMLElement).closest !== 'function') {
        setHoveredKey(null);
        return;
      }
      const target = (e.target as HTMLElement).closest("[data-edit-key]");
      if (target) {
        (target as HTMLElement).style.outline = "";
      }
    };

    const handleClick = async (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest || typeof (e.target as HTMLElement).closest !== 'function') return;
      const target = (e.target as HTMLElement).closest("[data-edit-key]");
      if (target) {
        e.preventDefault();
        e.stopPropagation();
        setActiveElement(target as HTMLElement);
        const attr = target.getAttribute("data-edit-attr") || "";
        setEditAttr(attr);
        const key = target.getAttribute("data-edit-key") || "";
        setEditKey(key);
        setEditingDishObj(null);
        
        if (key.startsWith("menu.add.")) {
          const parts = key.split(".");
          const collectionId = parts[2];
          try {
            const { collections: cols } = await apiFetch("/menu");
            if (cols) setMenuCollections(cols);
          } catch (e) {}
          setEditingDishObj({
            code: "",
            name: "",
            price_cents: 0,
            dietary: [],
            sort_order: 0,
            translations: {},
            collection_id: collectionId,
            showImage: false,
            image: ""
          } as any);
        } else if (key.startsWith("menu.")) {
          const parts = key.split(".");
          const dishId = parts[1];
          try {
            const [{ collections: cols, dishes }, settings] = await Promise.all([
              apiFetch("/menu"),
              apiFetch("/settings")
            ]);
            
            const dish = dishes?.find((d: any) => d.id === dishId);
            if (dish) {
              const imgConfig = (settings.menu_images as any)?.[dishId] || { show_image: false, image_url: "" };
              setEditingDishObj({ ...dish, showImage: imgConfig.show_image, image: imgConfig.image_url });
            }
            if (cols) {
              setMenuCollections(cols);
            }
          } catch (e) {}
        } else {
          // Try to get text, src, or href
          if (attr === "src" || target.tagName === "IMG") {
            setEditValue((target as HTMLImageElement).src);
          } else if (attr === "href") {
            setEditValue((target as HTMLAnchorElement).href || "");
          } else {
            setEditValue(target.textContent?.trim() || "");
          }
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveElement(null);
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("click", handleClick, { capture: true });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("click", handleClick, { capture: true });
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditing]);

  const handleSaveDishObj = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDishObj) return;
    try {
      const { showImage, image, ...toSave } = editingDishObj;
      
      let savedId = toSave.id;
      const res = await apiFetch("/admin/dishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toSave),
      });
      savedId = res.id;
      
      if (savedId) {
        const settings = await apiFetch("/settings");
        const imgConfig = (settings.menu_images as any) || {};
        imgConfig[savedId] = { show_image: showImage, image_url: image };
        await apiFetch("/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ menu_images: imgConfig })
        });
      }

      queryClient.invalidateQueries({ queryKey: ["menu"] });
      alert(`Saved dish successfully!`);
      setActiveElement(null);
    } catch (err: any) {
      alert("Error saving dish: " + err.message);
    }
  };

  const handleSave = async () => {
    if (!activeElement || !editKey) return;
    
    try {
      if (editKey.startsWith("i18n.")) {
        const transKey = editKey.replace("i18n.", "");
        const settings = await apiFetch("/settings");
        const currentTrans = (settings.site_translations as Record<string, Record<string, string>>) || {};
        
        const langDict = currentTrans[lang] || {};
        langDict[transKey] = editValue;
        
        await apiFetch("/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ site_translations: { ...currentTrans, [lang]: langDict } })
        });
      } else if (!editKey.startsWith("menu.")) {
        const settings = await apiFetch("/settings");
        const currentConfig = settings.restaurant_info || {};
        
        const parts = editKey.split(".");
        let current = currentConfig;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = editValue;
        
        await apiFetch("/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ restaurant_info: currentConfig })
        });
      }
      
      if (!editKey.startsWith("menu.")) {
        if (editAttr === "src" || activeElement.tagName === "IMG") {
          (activeElement as HTMLImageElement).src = editValue;
        } else if (editAttr === "href") {
          (activeElement as HTMLAnchorElement).href = editValue;
        } else {
          activeElement.textContent = editValue;
        }
      }

      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
      
      if (!editKey.startsWith("menu.")) {
        alert(`Saved ${editKey} to database successfully!`);
        setActiveElement(null);
      }
    } catch (err: any) {
      alert("Error saving to database: " + err.message);
    }
  };

  if (!isEditing) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-emerald text-[#15191a] p-2 text-center font-bold z-[100] shadow-[0_-10px_30px_rgba(16,185,129,0.2)]">
        LIVE EDIT MODE ACTIVE — Click on text or images to edit
      </div>
      
      {activeElement && (
        <div className="fixed inset-0 z-[110] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`relative bg-[#15191a] border border-border/30 p-6 rounded-xl w-full ${editKey.startsWith("menu.") ? "max-w-2xl" : "max-w-lg"} shadow-2xl max-h-[90vh] flex flex-col`}>
            <button 
              onClick={() => setActiveElement(null)}
              className="absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground transition-colors z-[120]"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-serif-display mb-4 flex items-center gap-2 shrink-0 pr-8">
              <Pencil className="w-5 h-5 text-emerald" /> 
              Editing {editKey.startsWith("menu.") ? "Dish" : editKey}
            </h3>
            
            {editKey.startsWith("menu.") && editingDishObj ? (
              <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
                <DishEditForm 
                  editingDish={editingDishObj}
                  setEditingDish={setEditingDishObj}
                  collections={menuCollections}
                  onSave={handleSaveDishObj}
                  onCancel={() => setActiveElement(null)}
                />
              </div>
            ) : (
              <>
                {editKey === "promotion.banner" && (
                  <p className="text-xs text-emerald mb-4 bg-emerald/10 p-2 rounded-md border border-emerald/20">
                    <strong>Recommended Image Specs:</strong> Ratio: 16:9 (Landscape).
                  </p>
                )}
                <textarea
                  className="w-full bg-background border border-border/30 rounded-lg p-3 text-foreground min-h-[100px] font-mono-data mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald shrink-0"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
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
                            setEditValue(url);
                            alert("Image pasted and uploaded successfully!");
                          } catch (err: any) {
                            alert("Failed to upload pasted image: " + err.message);
                          }
                        }
                        break;
                      }
                    }
                  }}
                />
                
                <div className="flex justify-end gap-3 shrink-0 mt-4">
                  <Button variant="outline" onClick={() => setActiveElement(null)}>
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-emerald text-[#15191a] hover:bg-emerald/90">
                    <Check className="w-4 h-4 mr-2" /> Apply Changes
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LiveEditor;
