import { useRef, useEffect } from "react";
import { useScroll, useVelocity, useSpring } from "framer-motion";
import { useGSAP } from "../hooks/useGSAP";

interface ScrollReactiveMarqueeProps {
  items: string[];
  baseVelocity?: number;
}

export function ScrollReactiveMarquee({
  items,
  baseVelocity = -40,
}: ScrollReactiveMarqueeProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const { prefersReducedMotion } = useGSAP();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion) return;

    let frame = 0;

    const tick = () => {
      const half = track.scrollWidth / 2 || 1;
      const boost = smoothVelocity.get() / 40;
      offset.current += (baseVelocity + boost) * 0.016;
      if (offset.current <= -half) offset.current += half;
      if (offset.current > 0) offset.current -= half;
      track.style.transform = `translate3d(${offset.current}px,0,0)`;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [baseVelocity, prefersReducedMotion, smoothVelocity]);

  const loop = [...items, ...items];

  return (
    <div
      ref={viewportRef}
      className="relative w-full min-w-0 max-w-full overflow-hidden py-6"
    >
      <div ref={trackRef} className="flex w-max gap-3 will-change-transform">
        {loop.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex shrink-0 items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 font-mono text-sm text-text-primary"
          >
            <span className="text-primary">▹</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
