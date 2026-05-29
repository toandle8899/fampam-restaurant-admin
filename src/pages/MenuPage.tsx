import Nav from "@/components/sections/Nav";
import Menu from "@/components/sections/Menu";
import Footer from "@/components/sections/Footer";

const MenuPage = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Nav />
      <div className="pt-24">
        <Menu mode="full" />
      </div>
      <Footer />
    </main>
  );
};

export default MenuPage;