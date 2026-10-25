import { useEffect, useState } from "react";
import { useGSAP } from "../hooks/useGSAP";

export function ScrollSpotlight() {
  const { prefersReducedMotion } = useGSAP();
  const [y, setY] = useState(30);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const onScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = window.scrollY / max;
      setY(12 + progress * 70);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    >
      <div
        className="absolute left-1/2 h-[42vh] w-[80vw] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          top: `${y}vh`,
          background:
            "radial-gradient(circle, rgba(100,255,218,0.28) 0%, rgba(100,255,218,0) 70%)",
        }}
      />
    </div>
  );
}
