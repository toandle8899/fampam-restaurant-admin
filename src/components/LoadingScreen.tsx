import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for the window load event to ensure all assets (fonts, images) are loaded
    const handleLoad = () => {
      // Add a small delay for a smoother effect
      setTimeout(() => setLoading(false), 1200);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    // Fallback just in case
    const timeout = setTimeout(() => setLoading(false), 4000);

    return () => {
      window.removeEventListener("load", handleLoad);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#171c14]"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <img 
              src="/logo%20fampam%20restaurant.png" 
              alt="Fampam Restaurant Logo" 
              className="h-16 sm:h-20 md:h-24 w-auto brightness-200 drop-shadow-lg" 
              style={{
                animation: "pulse-calm 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite"
              }}
            />
            <style>{`
              @keyframes pulse-calm {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(0.98); }
              }
            `}</style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

