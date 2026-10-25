import { useEffect, useRef } from "react";

export function CursorTrail() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const ringEl = ring.current;
    const dotEl = dot.current;
    if (!ringEl || !dotEl) return;

    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;
    let visible = false;
    let hover = false;
    let raf = 0;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        ringEl.style.opacity = "1";
        dotEl.style.opacity = "1";
        rx = x;
        ry = y;
      }
      const target = e.target;
      hover =
        target instanceof Element &&
        Boolean(target.closest("a, button, [role='button']"));
    };

    const tick = () => {
      rx += (x - rx) * 0.22;
      ry += (y - ry) * 0.22;
      ringEl.style.transform = `translate3d(${rx - 18}px,${ry - 18}px,0) scale(${hover ? 1.45 : 1})`;
      dotEl.style.transform = `translate3d(${x - 3}px,${y - 3}px,0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] hidden md:block">
      <div
        ref={ring}
        className="absolute left-0 top-0 h-9 w-9 rounded-full border border-primary opacity-0"
      />
      <div
        ref={dot}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-primary opacity-0"
      />
    </div>
  );
}
