import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Menu from "@/components/sections/Menu";
import Promotion from "@/components/sections/Promotion";
import ScrollToTop from "@/components/ScrollToTop";
import LiveEditor from "@/components/admin/LiveEditor";
import React, { lazy, Suspense } from "react";

const Reserve = lazy(() => import("@/components/sections/Reserve"));
const Delivery = lazy(() => import("@/components/sections/Delivery"));
const Footer = lazy(() => import("@/components/sections/Footer"));

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Menu />
      <Promotion />
      <Suspense fallback={<div className="min-h-[50vh] bg-background" />}>
        <Reserve />
        <Delivery />
        <Footer />
      </Suspense>
      <ScrollToTop />
      <LiveEditor />
    </main>
  );
};

export default Index;
