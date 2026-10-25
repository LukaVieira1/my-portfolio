import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "../hooks/useGSAP";

gsap.registerPlugin(ScrollTrigger);

interface SectionTitleRevealProps {
  number: string;
  title: string;
}

export function SectionTitleReveal({ number, title }: SectionTitleRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const { prefersReducedMotion } = useGSAP();

  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) {
      setCount(parseInt(number));
      return;
    }

    const container = containerRef.current;
    const numberEl = numberRef.current;
    const titleEl = titleRef.current;

    const counter = { value: 0 };
    const targetNumber = parseInt(number);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        once: true,
      },
    });

    tl.fromTo(
      numberEl,
      {
        scale: 0.4,
        opacity: 0,
        y: 24,
      },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "back.out(1.6)",
      }
    );

    // Count up animation
    tl.to(
      counter,
      {
        value: targetNumber,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: () => {
          setCount(Math.floor(counter.value));
        },
      },
      "-=0.5"
    );

    // Glowing effect
    tl.to(
      numberEl,
      {
        textShadow: "0 0 30px rgba(100,255,218,0.8), 0 0 60px rgba(100,255,218,0.4)",
        duration: 0.3,
        yoyo: true,
        repeat: 1,
      },
      "-=0.3"
    );

    // Title reveal with clip-path
    tl.fromTo(
      titleEl,
      {
        clipPath: "inset(0 100% 0 0)",
        x: -50,
      },
      {
        clipPath: "inset(0 0% 0 0)",
        x: 0,
        duration: 1.2,
        ease: "power4.out",
      },
      "-=0.5"
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [number, title, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-4 mb-12 relative overflow-hidden"
    >
      <span
        ref={numberRef}
        className="text-4xl md:text-6xl font-bold text-primary font-mono tabular-nums leading-none"
        style={{
          textShadow: "0 0 20px rgba(100,255,218,0.3)",
        }}
      >
        {count.toString().padStart(2, "0")}.
      </span>
      <span
        ref={titleRef}
        className="text-3xl md:text-4xl font-bold text-text-primary"
      >
        {title}
      </span>
    </div>
  );
}
