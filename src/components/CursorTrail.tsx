import { useEffect, useRef } from "react";

export function CursorTrail() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = dot.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      el.style.transform = `translate3d(${e.clientX - 8}px,${e.clientY - 8}px,0)`;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div
      ref={dot}
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-4 w-4 rounded-full bg-primary mix-blend-difference md:block"
    />
  );
}
