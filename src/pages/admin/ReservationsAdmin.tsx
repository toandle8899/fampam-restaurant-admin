import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Check, X, Clock } from "lucide-react";
import { format } from "date-fns";

type Reservation = {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  time: string;
  party_size: number;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
};

export const ReservationsAdmin = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [emailTemplate, setEmailTemplate] = useState("Hi {name},\n\nThank you for your reservation request for {party_size} people on {date} at {time}.\n\nYour reservation is confirmed!\n\nBest regards,\nFampam Team");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    
    try {
      const [resData, settings] = await Promise.all([
        apiFetch("/admin/reservations"),
        apiFetch("/settings")
      ]);
      
      setReservations(resData as Reservation[]);
      
      if (settings.restaurant_info?.emailTemplate) {
        setEmailTemplate(settings.restaurant_info.emailTemplate);
      }
    } catch (err: any) {
      console.error("Failed to fetch reservations:", err);
    }
    
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: Reservation["status"]) => {
    try {
      await apiFetch(`/admin/reservations/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setReservations(prev => 
        prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
      );
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-emerald text-[#15191a]"><Check className="w-3 h-3 mr-1"/> Confirmed</Badge>;
      case "cancelled":
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1"/> Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>;
    }
  };

  const handleReply = async (res: Reservation) => {
    try {
      setSendingId(res.id);
      
      await apiFetch(`/admin/reservations/${res.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservation: res,
          emailTemplate
        })
      });

      alert(`Confirmation email sent successfully to ${res.email}!`);
      
      // Auto-update status to confirmed if it wasn't already
      if (res.status !== "confirmed") {
        setReservations(prev => 
          prev.map(r => r.id === res.id ? { ...r, status: "confirmed" } : r)
        );
      }
    } catch (err: any) {
      alert("Failed to send email: " + (err.message || "Unknown error"));
    } finally {
      setSendingId(null);
    }
  };

  if (loading) return <div>Loading reservations...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif-display text-3xl">Booking Management</h2>
          <p className="text-sm text-muted-foreground font-mono-data uppercase">View and manage customer reservation requests.</p>
        </div>
        <Button variant="outline" onClick={fetchReservations}>Refresh</Button>
      </div>

      <div className="rounded-md border border-border/20">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Party</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No reservations found.</TableCell>
              </TableRow>
            ) : (
              reservations.map((res) => (
                <TableRow key={res.id}>
                  <TableCell>
                    <div className="font-medium">{res.date}</div>
                    <div className="text-sm text-muted-foreground">{res.time}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{res.name}</div>
                    <div className="text-sm text-muted-foreground">{res.email}</div>
                    {res.message && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 italic border-l-2 border-emerald/50 pl-2">
                        "{res.message}"
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="font-mono-data">{res.party_size} px</TableCell>
                  <TableCell>
                    {getStatusBadge(res.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleReply(res)} title="Send Confirmation Email" disabled={sendingId === res.id}>
                        {sendingId === res.id ? <Clock className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                      </Button>
                      {res.status !== "confirmed" && (
                        <Button size="sm" variant="outline" className="text-emerald border-emerald hover:bg-emerald hover:text-[#15191a]" onClick={() => updateStatus(res.id, "confirmed")}>
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      {res.status !== "cancelled" && (
                        <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-white" onClick={() => updateStatus(res.id, "cancelled")}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
