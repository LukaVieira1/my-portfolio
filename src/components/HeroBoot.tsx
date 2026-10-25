import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "../hooks/useGSAP";

interface HeroBootProps {
  greeting: string;
  name: string;
  description: string;
  ctaText: string;
  onCta: () => void;
}

export function HeroBoot({
  greeting,
  name,
  description,
  ctaText,
  onCta,
}: HeroBootProps) {
  const rootRef = useRef<HTMLElement>(null);
  const { prefersReducedMotion } = useGSAP();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const bits = root.querySelectorAll("[data-enter]");
    if (prefersReducedMotion) {
      gsap.set(bits, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      bits,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.12,
      },
    );
  }, [prefersReducedMotion, name]);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100dvh] min-w-0 flex-col justify-center overflow-hidden px-5 pb-16 pt-24 md:px-10"
    >
      <p data-enter className="mb-4 font-mono text-xs text-primary md:text-sm">
        <span className="opacity-60">~/</span> {greeting}
      </p>
      <h1
        data-enter
        className="max-w-[18ch] text-5xl font-extrabold leading-[0.95] tracking-tight text-text-primary md:text-7xl"
      >
        {name}
      </h1>
      <p
        data-enter
        className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg"
      >
        {description}
      </p>
      <div data-enter className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onCta}
          className="rounded-sm border border-primary bg-primary/10 px-5 py-3 font-mono text-sm text-primary"
        >
          ./{ctaText.toLowerCase()} →
        </button>
        <span className="font-mono text-xs text-text-secondary">
          senior · fullstack · react
        </span>
      </div>
    </section>
  );
}
