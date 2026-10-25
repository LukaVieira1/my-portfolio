import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "../hooks/useGSAP";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

gsap.registerPlugin(ScrollTrigger);

export function AnimatedCounter({
  end,
  duration = 2,
  suffix = "",
  className = "",
}: AnimatedCounterProps) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const { prefersReducedMotion } = useGSAP();

  useEffect(() => {
    if (!counterRef.current) return;

    const element = counterRef.current;

    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    const counter = { value: 0 };

    const scrollTrigger = ScrollTrigger.create({
      trigger: element,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          value: end,
          duration: duration,
          ease: "power2.out",
          onUpdate: () => {
            setCount(Math.floor(counter.value));
          },
        });
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [end, duration, prefersReducedMotion]);

  return (
    <span ref={counterRef} className={className}>
      {count}
      {suffix}
    </span>
  );
}
