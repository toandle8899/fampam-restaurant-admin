import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { DbDish } from "@/hooks/useMenu";
import { ImageIcon, Save, ArrowUp, ArrowDown } from "lucide-react";
import { translations as staticTranslations } from "@/i18n/translations";
import { DishEditForm } from "@/components/admin/DishEditForm";

export const MenuAdmin = () => {
  const [dishes, setDishes] = useState<DbDish[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuImages, setMenuImages] = useState<Record<string, any>>({});
  const [siteTrans, setSiteTrans] = useState<Record<string, Record<string, string>>>({});
  const [editingDish, setEditingDish] = useState<Partial<DbDish> & { showImage?: boolean, image?: string, translations?: any, has_variants?: boolean, variants?: any[] } | null>(null);

  const DIETARY_OPTIONS = [
    { code: "V", label: "Vegetarian (VG)" },
    { code: "VV", label: "Vegan (V)" },
    { code: "G", label: "Gluten-Free (GF)" },
    { code: "NF", label: "Nut-Free (NF)" },
    { code: "SF", label: "Shellfish-Free (SF)" },
  ];

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const [menuData, settings] = await Promise.all([
        apiFetch("/menu"),
        apiFetch("/settings")
      ]);
      
      if (menuData.dishes) setDishes(menuData.dishes);
      if (menuData.collections) setCollections(menuData.collections);
      
      if (settings.menu_images) setMenuImages(settings.menu_images);
      if (settings.site_translations) setSiteTrans(settings.site_translations);
    } catch (err: any) {
      console.error(err);
    }
    setLoading(false);
  };

  const toggleDietary = (code: string) => {
    if (!editingDish) return;
    const current = Array.isArray(editingDish.dietary) ? [...editingDish.dietary] : [];
    if (current.includes(code)) {
      setEditingDish({ ...editingDish, dietary: current.filter(c => c !== code) });
    } else {
      setEditingDish({ ...editingDish, dietary: [...current, code] });
    }
  };

  const updateTranslation = (lang: string, field: "name" | "description", value: string) => {
    if (!editingDish) return;
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish) return;
    
    const { showImage, image, ...toSave } = editingDish;
    
    let savedId: string | undefined;
    try {
      const res = await apiFetch("/admin/dishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toSave),
      });
      savedId = res.id;
    } catch (e: any) {
      alert("Error saving dish: " + e.message);
      return;
    }

    if (savedId) {
      const updatedImages = { ...menuImages, [savedId]: { show_image: showImage, image_url: image } };
      await apiFetch("/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menu_images: updatedImages })
      });
    }

    setIsModalOpen(false);
    fetchDishes();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this dish?")) {
      await apiFetch(`/admin/dishes/${id}`, { method: "DELETE" });
      fetchDishes();
    }
  };

  const handleMoveDish = async (dishId: string, direction: "up" | "down", colId: string) => {
    const colDishes = dishes.filter(d => d.collection_id === colId);
    const idx = colDishes.findIndex(d => d.id === dishId);
    if (idx === -1) return;
    
    if (direction === "up" && idx > 0) {
      const swapWith = colDishes[idx - 1];
      const newOrder = swapWith.sort_order;
      const oldOrder = colDishes[idx].sort_order;
      await Promise.all([
        apiFetch(`/admin/dishes/${colDishes[idx].id}/sort_order`, { method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ sort_order: newOrder }) }),
        apiFetch(`/admin/dishes/${swapWith.id}/sort_order`, { method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ sort_order: oldOrder }) })
      ]);
      fetchDishes();
    } else if (direction === "down" && idx < colDishes.length - 1) {
      const swapWith = colDishes[idx + 1];
      const newOrder = swapWith.sort_order;
      const oldOrder = colDishes[idx].sort_order;
      await Promise.all([
        apiFetch(`/admin/dishes/${colDishes[idx].id}/sort_order`, { method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ sort_order: newOrder }) }),
        apiFetch(`/admin/dishes/${swapWith.id}/sort_order`, { method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ sort_order: oldOrder }) })
      ]);
      fetchDishes();
    }
  };

  const openNew = () => {
    setEditingDish({ code: "", name: "", price_cents: 0, dietary: [], sort_order: 0, translations: {} } as any);
    setIsModalOpen(true);
  };

  const handleSaveTranslations = async () => {
    try {
      await apiFetch("/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site_translations: siteTrans })
      });
      alert("Translations saved!");
    } catch (err: any) {
      alert("Failed to save translations: " + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  const translationKeys = Object.keys(staticTranslations.en);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif-display font-bold">Content Management</h2>
      </div>

      <Tabs defaultValue="dishes">
        <TabsList className="mb-4">
          <TabsTrigger value="dishes">Menu Dishes</TabsTrigger>
          <TabsTrigger value="site">Site Translations</TabsTrigger>
        </TabsList>

        <TabsContent value="site">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Edit global UI text for all languages.</p>
              <Button onClick={handleSaveTranslations} className="bg-emerald text-[#15191a]">
                <Save className="w-4 h-4 mr-2" /> Save Translations
              </Button>
            </div>
            
            <div className="border rounded-lg max-h-[60vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Key / English Default</TableHead>
                    <TableHead>Vietnamese (VI)</TableHead>
                    <TableHead>Polish (PL)</TableHead>
                    <TableHead>German (DE)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {translationKeys.map(k => (
                    <TableRow key={k}>
                      <TableCell>
                        <div className="font-mono-data text-xs text-emerald mb-1">{k}</div>
                        <div className="text-sm opacity-70">{staticTranslations.en[k as keyof typeof staticTranslations.en]}</div>
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={siteTrans.vi?.[k] || ""} 
                          onChange={e => setSiteTrans(prev => ({...prev, vi: {...(prev.vi||{}), [k]: e.target.value}}))}
                          placeholder={staticTranslations.vi[k as keyof typeof staticTranslations.vi] || "Translate..."}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={siteTrans.pl?.[k] || ""} 
                          onChange={e => setSiteTrans(prev => ({...prev, pl: {...(prev.pl||{}), [k]: e.target.value}}))}
                          placeholder={staticTranslations.pl[k as keyof typeof staticTranslations.pl] || "Translate..."}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={siteTrans.de?.[k] || ""} 
                          onChange={e => setSiteTrans(prev => ({...prev, de: {...(prev.de||{}), [k]: e.target.value}}))}
                          placeholder={staticTranslations.de[k as keyof typeof staticTranslations.de] || "Translate..."}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dishes">
          <div className="flex justify-between mb-4 gap-4">
            <Input 
              placeholder="Search dishes by name or code..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="max-w-md bg-background/50"
            />
            <Button onClick={openNew}>Add New Dish</Button>
          </div>
        {collections.map(col => {
            const colDishes = dishes.filter(d => 
              d.collection_id === col.id && 
              (!searchQuery || 
                d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                d.code.toLowerCase().includes(searchQuery.toLowerCase())
              )
            );
            if (colDishes.length === 0) return null;
            return (
              <div key={col.id} className="mb-8">
                <h3 className="text-lg font-bold mb-2 font-serif-display text-emerald">{col.label}</h3>
                <div className="border rounded-lg bg-background/50">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Order</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {colDishes.map((d, i) => (
                        <TableRow key={d.id}>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <button disabled={i === 0} onClick={() => handleMoveDish(d.id, "up", col.id)} className="p-1 hover:bg-emerald hover:text-[#15191a] rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current transition-colors">
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button disabled={i === colDishes.length - 1} onClick={() => handleMoveDish(d.id, "down", col.id)} className="p-1 hover:bg-emerald hover:text-[#15191a] rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current transition-colors">
                                <ArrowDown className="w-4 h-4" />
                              </button>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono-data">{d.code}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {d.name}
                              {menuImages[d.id]?.show_image && <ImageIcon className="w-4 h-4 text-emerald" />}
                            </div>
                          </TableCell>
                          <TableCell>€{(d.price_cents / 100).toFixed(2)}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => { 
                              const imgConfig = menuImages[d.id] || { show_image: false, image_url: "" };
                              setEditingDish({ ...d, showImage: imgConfig.show_image, image: imgConfig.image_url }); 
                              setIsModalOpen(true); 
                            }}>Edit</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(d.id)}>Delete</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            );
          })}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDish?.id ? "Edit Dish" : "Add Dish"}</DialogTitle>
          </DialogHeader>
          {editingDish && (
            <DishEditForm
              editingDish={editingDish}
              setEditingDish={setEditingDish}
              collections={collections}
              onSave={handleSave}
              onCancel={() => setIsModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      </TabsContent>
      </Tabs>
    </div>
  );
};
