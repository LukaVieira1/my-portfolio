import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "../hooks/useGSAP";
import { mainTechs } from "../data";

gsap.registerPlugin(ScrollTrigger);

interface AboutRevealProps {
  paragraphs: string[];
  techsLabel: string;
  yearsIt: string;
  yearsDev: string;
}

export function AboutReveal({
  paragraphs,
  techsLabel,
  yearsIt,
  yearsDev,
}: AboutRevealProps) {
  const rootRef = useRef<HTMLElement>(null);
  const { prefersReducedMotion } = useGSAP();
  const words = paragraphs.join(" ").split(/\s+/);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion) return;
    const nodes = root.querySelectorAll("[data-word]");
    nodes.forEach((node, i) => {
      gsap.fromTo(
        node,
        { color: "rgba(142,163,181,0.28)" },
        {
          color: i % 11 === 0 ? "#64ffda" : "#f3fff9",
          ease: "none",
          scrollTrigger: {
            trigger: node,
            start: "top 82%",
            end: "top 42%",
            scrub: 0.4,
          },
        },
      );
    });
    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        const trigger = st.vars.trigger;
        if (trigger instanceof Node && root.contains(trigger)) st.kill();
      });
    };
  }, [prefersReducedMotion, words.length]);

  return (
    <section
      id="about"
      ref={rootRef}
      className="min-w-0 px-5 py-24 md:px-12"
    >
      <div className="mb-10 flex gap-10 font-mono text-primary">
        <div>
          <div className="text-5xl font-extrabold">8+</div>
          <div className="text-[11px] text-text-secondary">{yearsIt}</div>
        </div>
        <div>
          <div className="text-5xl font-extrabold">5+</div>
          <div className="text-[11px] text-text-secondary">{yearsDev}</div>
        </div>
      </div>
      <p className="max-w-5xl break-words text-[7.4vw] font-extrabold leading-[1.2] tracking-[-0.03em] [word-spacing:0.12em] md:text-5xl">
        {words.map((word, i) => (
          <span key={`${word}-${i}`} data-word className="word-dim inline pr-[0.12em]">
            {word}{" "}
          </span>
        ))}
      </p>
      <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
        {techsLabel}
      </p>
      <div className="relative mt-4 min-w-0 overflow-hidden">
        <div className="flex w-max gap-3 animate-[marquee_28s_linear_infinite]">
          {[...mainTechs, ...mainTechs].map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="shrink-0 rounded-full border border-primary/25 px-3 py-1 font-mono text-xs text-text-primary"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      <img
        src="/profile-pic.jpeg"
        alt="Luka Vieira"
        className="mt-12 h-56 w-full max-w-xs object-cover grayscale md:h-72"
      />
    </section>
  );
}
