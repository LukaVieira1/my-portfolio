import { useEffect } from "react";
import Lenis from "lenis";
import { setScrollProgress } from "../lib/scrollStore";
import { assert } from "../lib/assert";

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    assert(lenis != null, "Lenis failed to initialize");

    const onScroll = ({ progress }: { progress: number }) => {
      setScrollProgress(progress);
    };

    lenis.on("scroll", onScroll);

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.off("scroll", onScroll);
      lenis.destroy();
    };
  }, []);
}
