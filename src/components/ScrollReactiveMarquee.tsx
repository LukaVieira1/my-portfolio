import { useRef, useEffect } from "react";
import { useScroll, useVelocity, useSpring, motion } from "framer-motion";
import { useGSAP } from "../hooks/useGSAP";

interface ScrollReactiveMarqueeProps {
  items: string[];
  baseVelocity?: number;
}

export function ScrollReactiveMarquee({
  items,
  baseVelocity = -2,
}: ScrollReactiveMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = useGSAP();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const x = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let animationFrame: number;

    const updatePosition = () => {
      const velocity = smoothVelocity.get();
      const factor = velocity / 500; // Scale velocity effect

      x.current += (baseVelocity + factor) * 0.5;

      if (x.current < -50) {
        x.current = 0;
      } else if (x.current > 0) {
        x.current = -50;
      }

      if (containerRef.current) {
        containerRef.current.style.transform = `translateX(${x.current}%)`;
      }

      animationFrame = requestAnimationFrame(updatePosition);
    };

    animationFrame = requestAnimationFrame(updatePosition);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [smoothVelocity, baseVelocity, prefersReducedMotion]);

  const doubledItems = [...items, ...items];

  return (
    <div className="overflow-hidden py-8 -mx-8">
      <div
        ref={containerRef}
        className="flex gap-8 whitespace-nowrap"
        style={{
          width: "200%",
        }}
      >
        {doubledItems.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-2 px-6 py-3 bg-primary/5 border border-primary/20 rounded-full"
            whileHover={{
              scale: 1.1,
              borderColor: "rgba(100,255,218,0.6)",
              boxShadow: "0 0 20px rgba(100,255,218,0.3)",
            }}
          >
            <span className="text-primary text-xl">▹</span>
            <span className="font-mono text-text-primary">{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
