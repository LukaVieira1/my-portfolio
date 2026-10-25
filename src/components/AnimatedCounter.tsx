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
  duration = 1.2,
  suffix = "",
  className = "",
}: AnimatedCounterProps) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(end);
  const { prefersReducedMotion } = useGSAP();

  useEffect(() => {
    const element = counterRef.current;
    if (!element) return;

    setCount(end);

    if (prefersReducedMotion) return;

    const counter = { value: 0 };
    setCount(0);

    const play = () => {
      gsap.to(counter, {
        value: end,
        duration,
        ease: "power2.out",
        onUpdate: () => setCount(Math.round(counter.value)),
        onComplete: () => setCount(end),
      });
    };

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top 95%",
      once: true,
      onEnter: play,
    });

    if (element.getBoundingClientRect().top < window.innerHeight) {
      play();
    }

    const fallback = window.setTimeout(() => setCount(end), (duration + 0.4) * 1000);

    return () => {
      window.clearTimeout(fallback);
      trigger.kill();
    };
  }, [end, duration, prefersReducedMotion]);

  return (
    <span ref={counterRef} className={className}>
      {count}
      {suffix}
    </span>
  );
}
