import { useEffect, useRef } from "react";

// Lazy-init: only create audio object on first user interaction
let audioPrototype: HTMLAudioElement | null = null;
const getAudio = () => {
  if (!audioPrototype) {
    audioPrototype = new Audio("/chopsticksound.mp3");
    audioPrototype.preload = "auto";
    audioPrototype.volume = 0.5;
  }
  return audioPrototype;
};

export const useClackSound = () => {
  const lastPlayTime = useRef(0);

  useEffect(() => {
    const playClack = () => {
      const now = Date.now();
      if (now - lastPlayTime.current < 200) return; // Debounce 200ms
      lastPlayTime.current = now;

      // Clone node to allow rapid successive clicks if outside debounce
      const clone = getAudio().cloneNode() as HTMLAudioElement;
      clone.volume = 0.5;
      clone.play().catch(e => console.warn("Audio play blocked", e));
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest && typeof target.closest === 'function' && (
          target.closest('a') || 
          target.closest('button') || 
          target.closest('[role="button"]') || 
          target.closest('[role="tab"]')
        )
      ) {
        playClack();
      }
    };

    const handleClick = () => {
      playClack();
    };

    document.addEventListener("mouseenter", handleHover, true);
    document.addEventListener("mousedown", handleClick, true);

    return () => {
      document.removeEventListener("mouseenter", handleHover, true);
      document.removeEventListener("mousedown", handleClick, true);
    };
  }, []);
};
