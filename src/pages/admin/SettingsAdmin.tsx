import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/ImageUpload";

export const SettingsAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPos, setSavingPos] = useState(false);
  const [posMsg, setPosMsg] = useState("");
  const [posConfig, setPosConfig] = useState({
    store_online: true,
    delivery_enabled: true,
    delivery_fee_cents: 350,
    min_order_cents: 1500,
    tax_rate: 0.19,
  });
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    website: "",
    heroVideo: "",
    emailTemplate: "",
    promotion: {
      banner: ""
    },
    socials: {
      facebook: "",
      ubereats: "",
      wolt: "",
      lieferando: ""
    },
    gallery: {
      row1: [] as string[],
      row2: [] as string[]
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const settings = await apiFetch("/settings");
      const val: any = settings.restaurant_info;
      if (val) {
        let parsedGallery = { row1: [] as string[], row2: [] as string[] };
        if (Array.isArray(val.gallery)) {
          const half = Math.ceil(val.gallery.length / 2);
          parsedGallery.row1 = val.gallery.slice(0, half) || [];
          parsedGallery.row2 = val.gallery.slice(half) || [];
        } else if (val.gallery) {
          parsedGallery.row1 = Array.isArray(val.gallery.row1) ? val.gallery.row1 : [];
          parsedGallery.row2 = Array.isArray(val.gallery.row2) ? val.gallery.row2 : [];
        }

        while (parsedGallery.row1.length < 6) parsedGallery.row1.push("");
        while (parsedGallery.row2.length < 6) parsedGallery.row2.push("");

        setForm((prev) => ({
          ...prev,
          ...val,
          promotion: {
            ...prev.promotion,
            ...(val.promotion || {})
          },
          socials: {
            ...prev.socials,
            ...(val.socials || {})
          },
          gallery: parsedGallery
        }));
      }
      if (settings.pos_config) {
        setPosConfig((prev: any) => ({ ...prev, ...settings.pos_config }));
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const savePosConfig = async () => {
    setSavingPos(true);
    setPosMsg("");
    try {
      await apiFetch("/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pos_config: posConfig }),
      });
      setPosMsg("POS settings saved!");
    } catch (err: any) {
      setPosMsg("Error: " + err.message);
    } finally {
      setSavingPos(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    
    try {
      await apiFetch("/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurant_info: form })
      });
      setMsg("Settings saved successfully!");
    } catch (err: any) {
      setMsg("Error saving settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSocialChange = (key: string, value: string) => {
    setForm(prev => ({
      ...prev,
      socials: { ...prev.socials, [key]: value }
    }));
  };

  const handleGalleryChange = (row: "row1" | "row2", index: number, value: string) => {
    const newRow = [...form.gallery[row]];
    newRow[index] = value;
    setForm(prev => ({ ...prev, gallery: { ...prev.gallery, [row]: newRow } }));
  };

  const addGalleryImage = (row: "row1" | "row2") => {
    setForm(prev => ({ ...prev, gallery: { ...prev.gallery, [row]: [...prev.gallery[row], ""] } }));
  };

  const removeGalleryImage = (row: "row1" | "row2", index: number) => {
    const newRow = [...form.gallery[row]];
    newRow.splice(index, 1);
    setForm(prev => ({ ...prev, gallery: { ...prev.gallery, [row]: newRow } }));
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="space-y-8 max-w-3xl">
      {/* POS Settings */}
      <section className="rounded-lg border border-border/15 p-6 bg-surface/50">
        <h2 className="font-serif-display text-2xl mb-1">Online Ordering (POS)</h2>
        <p className="text-sm text-muted-foreground mb-6">Control your online store, delivery, and pricing.</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex items-center justify-between rounded-md border border-border/15 bg-background p-4">
            <div>
              <Label className="font-serif-display">Store Online</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Allow customers to place orders</p>
            </div>
            <Switch
              checked={posConfig.store_online}
              onCheckedChange={(v) => setPosConfig((p) => ({ ...p, store_online: v }))}
            />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border/15 bg-background p-4">
            <div>
              <Label className="font-serif-display">Delivery Enabled</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Offer delivery option</p>
            </div>
            <Switch
              checked={posConfig.delivery_enabled}
              onCheckedChange={(v) => setPosConfig((p) => ({ ...p, delivery_enabled: v }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Delivery Fee (€)</Label>
            <Input
              type="number"
              step="0.01"
              value={(posConfig.delivery_fee_cents / 100).toFixed(2)}
              onChange={(e) => setPosConfig((p) => ({ ...p, delivery_fee_cents: Math.round(parseFloat(e.target.value || '0') * 100) }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Minimum Order (€)</Label>
            <Input
              type="number"
              step="0.01"
              value={(posConfig.min_order_cents / 100).toFixed(2)}
              onChange={(e) => setPosConfig((p) => ({ ...p, min_order_cents: Math.round(parseFloat(e.target.value || '0') * 100) }))}
            />
          </div>
        </div>
        <div className="flex items-center gap-4 pt-4 mt-4">
          <Button onClick={savePosConfig} disabled={savingPos} className="bg-emerald text-[#15191a] hover:bg-emerald/90">
            {savingPos ? "Saving..." : "Save POS Settings"}
          </Button>
          {posMsg && <span className={`text-sm ${posMsg.includes("Error") ? "text-destructive" : "text-emerald"}`}>{posMsg}</span>}
        </div>
      </section>

      <div className="flex justify-between items-center bg-surface/50 p-6 rounded-lg border border-border/15">
        <div>
          <h2 className="font-serif-display text-2xl mb-1">Live Canvas Edit</h2>
          <p className="text-sm text-muted-foreground">Visually edit site content directly on the frontend.</p>
        </div>
        <Button asChild className="bg-emerald text-[#15191a] hover:bg-emerald/90">
          <a href="/?edit=true" target="_blank" rel="noopener noreferrer">
            Enter Live Edit Mode
          </a>
        </Button>
      </div>

      <section className="rounded-lg border border-border/15 p-6 bg-surface/50">
        <h2 className="font-serif-display text-2xl mb-6">Site Content & Settings</h2>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Restaurant Name</Label>
              <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Description / Tagline</Label>
              <Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Website</Label>
              <Input value={form.website} onChange={e => setForm({...form, website: e.target.value})} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Hero Video Embed URL (e.g. https://streamable.com/e/0k2kvo?autoplay=1)</Label>
              <p className="text-xs text-muted-foreground mt-0 mb-2">
                Preferable ratio: <span className="font-semibold text-emerald">16:9 (Landscape)</span>. Use a lightweight embed URL for optimal page load speed.
              </p>
              <Input type="url" value={form.heroVideo} onChange={e => setForm({...form, heroVideo: e.target.value})} />
            </div>

            <div className="space-y-2 md:col-span-2 border-t border-border/15 pt-4 mt-2">
              <Label>Promotion Banner Image URL</Label>
              <p className="text-xs text-muted-foreground mt-0 mb-2">
                Preferable ratio: <span className="font-semibold text-emerald">16:9 (Landscape)</span>. Use a lightweight image under 500KB.
              </p>
              <div className="flex items-center gap-2">
                <Input 
                  type="url" 
                  value={form.promotion?.banner || ""} 
                  onChange={e => setForm({...form, promotion: { ...form.promotion, banner: e.target.value }})} 
                  onPaste={async (e) => {
                    const items = e.clipboardData?.items;
                    if (!items) return;
                    for (let j = 0; j < items.length; j++) {
                      if (items[j].type.indexOf("image") !== -1) {
                        e.preventDefault();
                        const file = items[j].getAsFile();
                        if (file) {
                          try {
                            const { uploadFileToR2 } = await import("@/components/ui/ImageUpload");
                            const uploadedUrl = await uploadFileToR2(file);
                            setForm({...form, promotion: { ...form.promotion, banner: uploadedUrl }});
                          } catch (err: any) {
                            alert("Failed to upload pasted image: " + err.message);
                          }
                        }
                        break;
                      }
                    }
                  }}
                />
                <ImageUpload onUpload={(newUrl) => setForm({...form, promotion: { ...form.promotion, banner: newUrl }})} />
              </div>
            </div>
            
            <div className="space-y-2 md:col-span-2 border-t border-border/15 pt-4 mt-2">
              <Label>Email Confirmation Template</Label>
              <p className="text-xs text-muted-foreground mt-1 mb-2">
                This is the text that gets pre-filled when you click "Reply" in the Booking Management tab. <br/>
                Available variables: <code className="text-emerald">{'{name}'}</code>, <code className="text-emerald">{'{date}'}</code>, <code className="text-emerald">{'{time}'}</code>, <code className="text-emerald">{'{party_size}'}</code>
              </p>
              <textarea
                className="w-full bg-background border border-border/15 rounded-md p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald min-h-[150px]"
                value={form.emailTemplate || ""}
                onChange={e => setForm({...form, emailTemplate: e.target.value})}
                placeholder="Dear {name},&#10;I want to confirm your booking reservation...&#10;If you want to make changes, reply to this mail or call 0308812460"
              />
            </div>
          </div>

          <hr className="border-border/15" />
          
          <h3 className="font-serif-display text-xl">Delivery & Social Links</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Wolt Link</Label>
              <Input type="url" placeholder="https://wolt.com/..." value={form.socials.wolt} onChange={e => handleSocialChange('wolt', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Lieferando Link</Label>
              <Input type="url" placeholder="https://www.lieferando.de/..." value={form.socials.lieferando} onChange={e => handleSocialChange('lieferando', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>UberEats Link</Label>
              <Input type="url" placeholder="https://www.ubereats.com/..." value={form.socials.ubereats} onChange={e => handleSocialChange('ubereats', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Facebook Link</Label>
              <Input type="url" placeholder="https://facebook.com/..." value={form.socials.facebook} onChange={e => handleSocialChange('facebook', e.target.value)} />
            </div>
          </div>

          <hr className="border-border/15" />
          
          <div className="flex items-center justify-between">
            <h3 className="font-serif-display text-xl">Gallery Row 1</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => addGalleryImage("row1")}>+ Add Image</Button>
          </div>
          <p className="text-sm text-muted-foreground mt-[-1rem]">Top scrolling row in the gallery section.</p>
          <p className="text-xs text-emerald mt-[-0.5rem] bg-emerald/10 p-2 rounded-md border border-emerald/20">
            <strong>Recommended Image Specs:</strong> Ratio: 1:1 (Square) or 4:5. Size: under 500KB per image.
          </p>
          
          <div className="space-y-3">
            {form.gallery.row1.map((url, i) => (
              <div key={`r1-${i}`} className="flex items-center gap-2">
                <Input 
                  type="url" 
                  placeholder="https://..." 
                  value={url} 
                  onChange={e => handleGalleryChange("row1", i, e.target.value)}
                  onPaste={async (e) => {
                    const items = e.clipboardData?.items;
                    if (!items) return;
                    for (let j = 0; j < items.length; j++) {
                      if (items[j].type.indexOf("image") !== -1) {
                        e.preventDefault();
                        const file = items[j].getAsFile();
                        if (file) {
                          try {
                            const { uploadFileToR2 } = await import("@/components/ui/ImageUpload");
                            const uploadedUrl = await uploadFileToR2(file);
                            handleGalleryChange("row1", i, uploadedUrl);
                          } catch (err: any) {
                            alert("Failed to upload pasted image: " + err.message);
                          }
                        }
                        break;
                      }
                    }
                  }}
                />
                <ImageUpload onUpload={(newUrl) => handleGalleryChange("row1", i, newUrl)} />
                <Button type="button" variant="destructive" size="icon" onClick={() => removeGalleryImage("row1", i)}>
                  &times;
                </Button>
              </div>
            ))}
            {form.gallery.row1.length === 0 && <p className="text-sm text-muted-foreground italic">No images in row 1.</p>}
          </div>

          <hr className="border-border/15" />
          
          <div className="flex items-center justify-between">
            <h3 className="font-serif-display text-xl">Gallery Row 2</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => addGalleryImage("row2")}>+ Add Image</Button>
          </div>
          <p className="text-sm text-muted-foreground mt-[-1rem]">Bottom scrolling row in the gallery section.</p>
          <p className="text-xs text-emerald mt-[-0.5rem] bg-emerald/10 p-2 rounded-md border border-emerald/20">
            <strong>Recommended Image Specs:</strong> Ratio: 1:1 (Square) or 4:5. Size: under 500KB per image.
          </p>
          
          <div className="space-y-3">
            {form.gallery.row2.map((url, i) => (
              <div key={`r2-${i}`} className="flex items-center gap-2">
                <Input 
                  type="url" 
                  placeholder="https://..." 
                  value={url} 
                  onChange={e => handleGalleryChange("row2", i, e.target.value)}
                  onPaste={async (e) => {
                    const items = e.clipboardData?.items;
                    if (!items) return;
                    for (let j = 0; j < items.length; j++) {
                      if (items[j].type.indexOf("image") !== -1) {
                        e.preventDefault();
                        const file = items[j].getAsFile();
                        if (file) {
                          try {
                            const { uploadFileToR2 } = await import("@/components/ui/ImageUpload");
                            const uploadedUrl = await uploadFileToR2(file);
                            handleGalleryChange("row2", i, uploadedUrl);
                          } catch (err: any) {
                            alert("Failed to upload pasted image: " + err.message);
                          }
                        }
                        break;
                      }
                    }
                  }}
                />
                <ImageUpload onUpload={(newUrl) => handleGalleryChange("row2", i, newUrl)} />
                <Button type="button" variant="destructive" size="icon" onClick={() => removeGalleryImage("row2", i)}>
                  &times;
                </Button>
              </div>
            ))}
            {form.gallery.row2.length === 0 && <p className="text-sm text-muted-foreground italic">No images in row 2.</p>}
          </div>

          <div className="flex items-center gap-4 pt-4 mt-6">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save All Settings"}
            </Button>
            {msg && <span className={`text-sm ${msg.includes("Error") ? "text-destructive" : "text-emerald"}`}>{msg}</span>}
          </div>
        </form>
      </section>
    </div>
  );
};
