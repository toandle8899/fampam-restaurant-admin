import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { useClackSound } from "./hooks/useClackSound";
import { LanguageProvider } from "./i18n/LanguageProvider";

const MenuPage = lazy(() => import("./pages/MenuPage.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.tsx"));

// POS Pages
const OrderMenu = lazy(() => import("./pages/OrderMenu.tsx"));
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const CustomerAuth = lazy(() => import("./pages/CustomerAuth.tsx"));
const CustomerDashboard = lazy(() => import("./pages/CustomerDashboard.tsx"));
const OrderTracking = lazy(() => import("./pages/OrderTracking.tsx"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess.tsx"));
const MockStripe = lazy(() => import("./pages/MockStripe.tsx"));

export const queryClient = new QueryClient();

const App = () => {
  useClackSound();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <CookieBanner />
          <BrowserRouter>
            <Suspense fallback={<div className="min-h-screen bg-[#171c14]" />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/menu" element={<MenuPage />} />
                
                {/* POS Routes */}
                <Route path="/order" element={<OrderMenu />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/account" element={<CustomerAuth />} />
                <Route path="/dashboard" element={<CustomerDashboard />} />
                <Route path="/order/success" element={<OrderSuccess />} />
                <Route path="/order/:id" element={<OrderTracking />} />
                <Route path="/mock-stripe" element={<MockStripe />} />

                <Route path="/admin/*" element={<Admin />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
