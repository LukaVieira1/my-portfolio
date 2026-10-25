import { useRef, useEffect } from "react";
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
  const { prefersReducedMotion } = useGSAP();

  useEffect(() => {
    const container = containerRef.current;
    const numberEl = numberRef.current;
    const titleEl = titleRef.current;
    if (!container || !numberEl || !titleEl) return;

    const show = () => {
      gsap.set(numberEl, { opacity: 1, y: 0, scale: 1, clearProps: "transform" });
      gsap.set(titleEl, { opacity: 1, x: 0, clipPath: "none" });
    };

    if (prefersReducedMotion) {
      show();
      return;
    }

    show();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 90%",
        once: true,
      },
    });

    tl.fromTo(
      numberEl,
      { opacity: 0, y: 18, scale: 0.85 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.5)" },
    ).fromTo(
      titleEl,
      { opacity: 0, x: 16 },
      { opacity: 1, x: 0, duration: 0.55, ease: "power3.out" },
      "-=0.25",
    );

    const fallback = window.setTimeout(show, 1600);

    return () => {
      window.clearTimeout(fallback);
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === container) trigger.kill();
      });
      show();
    };
  }, [number, title, prefersReducedMotion]);

  return (
    <h2
      ref={containerRef}
      className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-2xl font-bold text-text-primary"
    >
      <span
        ref={numberRef}
        className="font-mono text-primary"
      >
        {number.padStart(2, "0")}.
      </span>
      <span ref={titleRef}>{title}</span>
    </h2>
  );
}
