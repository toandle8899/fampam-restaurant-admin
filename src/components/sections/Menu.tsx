import { useT } from "@/i18n/LanguageProvider";
import { useEditMode } from "@/components/admin/LiveEditor";
import { MenuAdmin } from "@/pages/admin/MenuAdmin";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface MenuProps {
  mode?: "preview" | "full";
}

const Menu = ({ mode = "preview" }: MenuProps) => {
  const { t } = useT();
  const isEditing = useEditMode();

  return (
    <section id="menu" className="relative bg-[#15191a] scroll-mt-0">
      <div className="container mx-auto max-w-5xl px-4 pt-16 pb-8 md:pt-24 md:pb-10">
        <div className="text-center relative">
          <h2 id="menu-title" data-edit-key="i18n.menu.title" className="font-serif-display text-4xl leading-tight md:text-5xl">
            {t("menu.title")}
          </h2>
          {isEditing && (
            <div className="mt-6 flex justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-emerald text-[#15191a] px-6 py-2 rounded-full font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-[#15191a] hover:scale-105 transition-transform">
                    Manage Menu Items (CMS)
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-background border-border/20 text-foreground">
                  <MenuAdmin />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
        <div className="flex flex-col items-center">
          <a
            href="https://pub-8cce0d5378724856b211904c1b1c0277.r2.dev/Fampam%20Menu.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex w-full md:inline-flex md:w-auto items-center justify-center gap-2 rounded-full bg-emerald px-6 md:px-8 py-4 md:py-5 text-[#15191a] font-bold transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald hover:scale-105"
          >
            <span data-edit-key="i18n.menu.cta.full" className="label-kicker text-sm md:text-base">{t("menu.cta.full")}</span>
            <span className="font-mono-data text-sm">⏎</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Menu;