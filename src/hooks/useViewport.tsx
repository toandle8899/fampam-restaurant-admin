import * as React from "react";

type ViewportState = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  // very narrow phones
  isSmallViewport: boolean;
  // devicePixelRatio and retina indicator
  dpr: number;
  isRetina: boolean;
};

const getViewportState = (): ViewportState => {
  if (typeof window === "undefined") {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isSmallViewport: false,
      dpr: 1,
      isRetina: false,
    };
  }

  const width = window.innerWidth;
  const dpr = typeof window.devicePixelRatio === "number" ? window.devicePixelRatio : 1;
  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    isSmallViewport: width < 420,
    dpr,
    isRetina: dpr > 1.3,
  };
};

export function useViewport() {
  const [viewport, setViewport] = React.useState<ViewportState>(getViewportState);

  React.useEffect(() => {
    const onResize = () => setViewport(getViewportState());
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  return viewport;
}
