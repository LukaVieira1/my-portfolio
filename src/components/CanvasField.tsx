import { useEffect, useRef } from "react";

export function CanvasField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dots = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.4,
      s: 0.08 + Math.random() * 0.25,
    }));

    let raf = 0;
    const draw = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(100,255,218,0.72)";
      for (const dot of dots) {
        dot.y -= dot.s / 180;
        if (dot.y < 0) dot.y = 1;
        ctx.beginPath();
        ctx.arc(dot.x * canvas.width, dot.y * canvas.height, dot.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      aria-hidden
    />
  );
}
