import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { useT } from "@/i18n/LanguageProvider";

interface ConsentPayload {
  consentId: string;
  timestamp: string;
  choice: "accept_all" | "rejected" | "custom";
  allowedCategories: {
    analytics: boolean;
    marketing: boolean;
  };
}

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
  });

  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const userConsent = localStorage.getItem("cookie_consent");
    if (!userConsent) {
      setIsVisible(true);
    } else {
      applyTrackingSettings(JSON.parse(userConsent));
    }
    
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        setHasScrolled(true);
      }
    };
    
    handleScroll(); // Check initial
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const generateUUID = () => {
    return crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const applyTrackingSettings = (payload: ConsentPayload) => {
    if (payload.allowedCategories.analytics) {
      console.log("Analytics enabled");
    }
    if (payload.allowedCategories.marketing) {
      console.log("Marketing enabled");
    }
  };

  const sendToDatabaseLog = async (payload: ConsentPayload) => {
    try {
      await apiFetch("/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consent_id: payload.consentId,
          timestamp: payload.timestamp,
          choice: payload.choice,
          categories: payload.allowedCategories,
          website_version: "1.0",
        })
      });
    } catch (err) {
      console.error("Failed to log consent:", err);
    }
  };

  const handleChoice = (choiceType: "accept_all" | "rejected" | "custom", allowedCategories: any) => {
    const consentPayload: ConsentPayload = {
      consentId: generateUUID(),
      timestamp: new Date().toISOString(),
      choice: choiceType,
      allowedCategories,
    };

    localStorage.setItem("cookie_consent", JSON.stringify(consentPayload));
    sendToDatabaseLog(consentPayload);
    applyTrackingSettings(consentPayload);
    setIsVisible(false);
  };

  const { t } = useT();

  if (!isVisible || !hasScrolled) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-[200] p-4 md:p-6 flex justify-center pointer-events-none"
      >
        <div className="bg-[#15191a] border border-border/20 shadow-2xl rounded-2xl p-6 md:p-8 w-full max-w-4xl pointer-events-auto flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-serif-display font-bold mb-2 md:mb-3">{t("cookie.title" as any)}</h3>
            <p className="text-sm md:text-base font-mono-data text-muted-foreground leading-relaxed">
              {t("cookie.desc" as any)}
            </p>
            {showPreferences && (
              <div className="mt-5 space-y-3 font-mono-data text-sm md:text-base bg-background/50 p-4 rounded-xl border border-border/10">
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked disabled className="accent-emerald w-4 h-4 md:w-5 md:h-5" />
                  <span>{t("cookie.necessary" as any)}</span>
                </label>
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={preferences.analytics} 
                    onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                    className="accent-emerald w-4 h-4 md:w-5 md:h-5"
                  />
                  <span>{t("cookie.analytics" as any)}</span>
                </label>
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={preferences.marketing} 
                    onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                    className="accent-emerald w-4 h-4 md:w-5 md:h-5"
                  />
                  <span>{t("cookie.marketing" as any)}</span>
                </label>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto mt-4 md:mt-0">
            {!showPreferences ? (
              <>
                <button
                  onClick={() => handleChoice("accept_all", { analytics: true, marketing: true })}
                  className="bg-emerald text-[#15191a] text-base font-bold py-3 px-6 rounded-full transition-transform hover:scale-105 w-full md:w-auto"
                >
                  {t("cookie.accept" as any)}
                </button>
                <button
                  onClick={() => handleChoice("rejected", { analytics: false, marketing: false })}
                  className="bg-transparent border border-border/50 text-foreground text-base py-3 px-6 rounded-full hover:bg-border/10 transition-colors w-full md:w-auto"
                >
                  {t("cookie.reject" as any)}
                </button>
                <button
                  onClick={() => setShowPreferences(true)}
                  className="text-muted-foreground text-sm font-mono-data underline underline-offset-4 hover:text-foreground transition-colors mt-2"
                >
                  {t("cookie.prefs" as any)}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleChoice("custom", preferences)}
                  className="bg-emerald text-[#15191a] text-base font-bold py-3 px-6 rounded-full transition-transform hover:scale-105 w-full md:w-auto"
                >
                  {t("cookie.save" as any)}
                </button>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="bg-transparent border border-border/50 text-foreground text-base py-3 px-6 rounded-full hover:bg-border/10 transition-colors w-full md:w-auto"
                >
                  {t("cookie.cancel" as any)}
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
