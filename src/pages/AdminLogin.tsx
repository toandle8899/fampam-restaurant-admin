import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

const AdminLogin = () => {
  const handleLogin = () => {
    // Redirects to a protected backend route which triggers Cloudflare Access,
    // and then redirects back to the SPA admin panel.
    window.location.href = "/api/admin/login";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm border-border/15 shadow-md">
        <CardHeader className="text-center space-y-1">
          <div className="flex justify-center mb-2">
            <ShieldCheck className="h-8 w-8 text-emerald" />
          </div>
          <CardTitle className="font-serif-display text-3xl">Admin Portal</CardTitle>
          <CardDescription className="font-mono-data text-xs uppercase tracking-widest">
            Secured by Cloudflare Zero Trust
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLogin}
            className="w-full bg-emerald text-[#15191a] hover:bg-emerald/90 font-serif-display font-semibold py-6 text-lg"
          >
            Authenticate
          </Button>
          <p className="mt-4 text-center font-mono-data text-[10px] text-muted-foreground">
            You will be redirected to Cloudflare Access to verify your identity.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
