import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuAdmin } from "./admin/MenuAdmin";
import { SettingsAdmin } from "./admin/SettingsAdmin";
import { ReservationsAdmin } from "./admin/ReservationsAdmin";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

  const [receivingEmail, setReceivingEmail] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [emailMsg, setEmailMsg] = useState("");

  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPass, setNewAdminPass] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [adminMsg, setAdminMsg] = useState("");

  const [restaurantInfoJson, setRestaurantInfoJson] = useState("");
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");

  useEffect(() => {
    apiFetch("/admin/me")
      .then(() => {
        setSession(true);
        fetchConfig();
        setLoading(false);
      })
      .catch(() => {
        navigate("/admin/login");
      });
  }, [navigate]);

  const fetchConfig = async () => {
    const settings = await apiFetch("/settings");
    if (settings.booking_config?.receiving_email) {
      setReceivingEmail(settings.booking_config.receiving_email);
    }
    
    if (settings.restaurant_info) {
      setRestaurantInfoJson(JSON.stringify(settings.restaurant_info, null, 2));
    }
  };

  const saveRestaurantInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingInfo(true);
    setInfoMsg("");
    
    try {
      const parsed = JSON.parse(restaurantInfoJson);
      await apiFetch("/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurant_info: parsed }),
      });
      setInfoMsg("Successfully updated restaurant info!");
    } catch (err: any) {
      setInfoMsg("Error saving config: " + err.message);
    } finally {
      setSavingInfo(false);
    }
  };

  const handleLogout = () => {
    // Redirect to the default Cloudflare Access logout endpoint.
    // Replace <your-team> with your actual team name if necessary, 
    // or just rely on the path if using custom domain.
    window.location.href = "/cdn-cgi/access/logout";
  };

  const saveEmailConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEmail(true);
    setEmailMsg("");
    
    try {
      await apiFetch("/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_config: { receiving_email: receivingEmail } }),
      });
      setEmailMsg("Successfully updated receiving email!");
    } catch (err: any) {
      setEmailMsg("Error saving config: " + err.message);
    } finally {
      setSavingEmail(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><p className="font-mono-data text-xs text-muted-foreground">Loading CMS...</p></div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="hairline-b sticky top-0 z-30 bg-background/95 p-4 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between">
          <div className="font-serif-display text-xl">Fampam Admin</div>
          <button onClick={handleLogout} className="font-mono-data text-xs text-muted-foreground hover:text-foreground">
            Sign out
          </button>
        </div>
      </header>
      
      <main className="container mx-auto p-4 py-8">
        <Tabs defaultValue="reservations" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="menu">Menu Items</TabsTrigger>
            <TabsTrigger value="settings">Site Content & Settings</TabsTrigger>
            <TabsTrigger value="system">System (Raw JSON)</TabsTrigger>
          </TabsList>

          <TabsContent value="reservations">
            <ReservationsAdmin />
          </TabsContent>

          <TabsContent value="menu">
            <MenuAdmin />
          </TabsContent>

          <TabsContent value="settings">
             <SettingsAdmin />
          </TabsContent>

          <TabsContent value="system">
            <div className="grid gap-8">
              <section className="rounded-lg border border-border/15 p-6">
                <h2 className="font-serif-display text-2xl mb-4">Reservations Configuration</h2>
                <p className="font-mono-data text-xs text-muted-foreground mb-4">Set the email address that receives booking requests.</p>
                <form onSubmit={saveEmailConfig} className="flex flex-col gap-4 max-w-sm">
                  <input
                    type="email"
                    required
                    value={receivingEmail}
                    onChange={(e) => setReceivingEmail(e.target.value)}
                    className="w-full rounded border border-border/15 bg-background px-3 py-2 font-mono-data text-sm outline-none focus:border-emerald"
                    placeholder="admin@fampam.com"
                  />
                  <button
                    type="submit"
                    disabled={savingEmail}
                    className="rounded bg-emerald px-4 py-2 font-mono-data text-sm font-semibold text-[#15191a] transition-colors hover:bg-emerald/90 disabled:opacity-50"
                  >
                    {savingEmail ? "Saving..." : "Save Configuration"}
                  </button>
                  {emailMsg && <p className="font-mono-data text-xs text-emerald">{emailMsg}</p>}
                </form>
              </section>

              <section className="rounded-lg border border-border/15 p-6">
                <h2 className="font-serif-display text-2xl mb-4">Site Content & Restaurant Info</h2>
                <p className="font-mono-data text-xs text-muted-foreground mb-4">Edit the raw JSON configuration for restaurant info.</p>
                <form onSubmit={saveRestaurantInfo} className="flex flex-col gap-4">
                  <textarea
                    required
                    value={restaurantInfoJson}
                    onChange={(e) => setRestaurantInfoJson(e.target.value)}
                    className="w-full h-96 rounded border border-border/15 bg-background px-3 py-2 font-mono-data text-[10px] outline-none focus:border-emerald"
                  />
                  <button
                    type="submit"
                    disabled={savingInfo}
                    className="rounded bg-emerald px-4 py-2 w-fit font-mono-data text-sm font-semibold text-[#15191a] transition-colors hover:bg-emerald/90 disabled:opacity-50"
                  >
                    {savingInfo ? "Saving..." : "Save Restaurant Info"}
                  </button>
                  {infoMsg && <p className="font-mono-data text-xs text-emerald">{infoMsg}</p>}
                </form>
              </section>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
