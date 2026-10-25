import { useEffect, useRef } from "react";

export function CursorTrail() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const ringEl = ring.current;
    const dotEl = dot.current;
    const labelEl = label.current;
    if (!ringEl || !dotEl || !labelEl) return;

    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;
    let visible = false;
    let hover = false;
    let view = false;
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
      const el = target instanceof Element ? target : null;
      hover = Boolean(el?.closest("a, button, [role='button']"));
      view = Boolean(el?.closest("[data-cursor='view']"));
      labelEl.style.opacity = view ? "1" : "0";
    };

    const tick = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      ringEl.style.transform = `translate3d(${rx - 18}px,${ry - 18}px,0) scale(${hover ? 1.35 : 1})`;
      dotEl.style.transform = `translate3d(${x - 2}px,${y - 2}px,0)`;
      labelEl.style.transform = `translate3d(${rx + 18}px,${ry + 14}px,0)`;
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
        className="absolute left-0 top-0 h-9 w-9 rounded-full border border-text-primary/55 opacity-0"
      />
      <div
        ref={dot}
        className="absolute left-0 top-0 h-1 w-1 rounded-full bg-text-primary opacity-0"
      />
      <div
        ref={label}
        className="absolute left-0 top-0 font-mono text-[10px] uppercase tracking-[0.18em] text-text-primary opacity-0"
      >
        view
      </div>
    </div>
  );
}
