import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  useEffect(() => {
    let lenis: Lenis | undefined;
    try {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      lenis = new Lenis({
        duration: reduced ? 0 : 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: !reduced,
        syncTouch: false,
        touchMultiplier: 1.2,
      });
      lenis.on("scroll", ScrollTrigger.update);
    } catch {
      return;
    }

    const ticker = (time: number) => {
      lenis?.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => {
      try {
        ScrollTrigger.refresh();
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(ticker);
      lenis?.destroy();
    };
  }, []);
}
