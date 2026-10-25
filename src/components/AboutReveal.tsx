import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "../hooks/useGSAP";
import { mainTechs } from "../data";
import { Shell } from "./Shell";

gsap.registerPlugin(ScrollTrigger);

interface AboutRevealProps {
  paragraphs: string[];
  techsLabel: string;
  yearsIt: string;
  yearsDev: string;
}

function readColor(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
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
    if (!root) return;
    const nodes = root.querySelectorAll<HTMLElement>("[data-word]");
    const base = readColor("--word-base", "#9eb3c4");
    const on = readColor("--word-on", "#f3fff9");
    const accent = readColor("--word-accent", "#64ffda");

    if (prefersReducedMotion) {
      nodes.forEach((node, i) => {
        node.style.color = i % 11 === 0 ? accent : on;
      });
      return;
    }

    const st = ScrollTrigger.create({
      trigger: root,
      start: "top 75%",
      end: "bottom 28%",
      scrub: 0.35,
      onUpdate: (self) => {
        const n = nodes.length || 1;
        nodes.forEach((node, i) => {
          const lit = i / n <= self.progress * 1.02;
          node.style.color = lit ? (i % 11 === 0 ? accent : on) : base;
        });
      },
      onLeave: () => {
        nodes.forEach((node, i) => {
          node.style.color = i % 11 === 0 ? accent : on;
        });
      },
    });

    return () => st.kill();
  }, [prefersReducedMotion, words.length]);

  return (
    <section id="about" ref={rootRef} className="min-w-0 py-24 md:py-32">
      <Shell>
        <div className="grid min-w-0 items-start gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:gap-16 xl:gap-20">
          <div className="min-w-0">
            <p className="break-words text-[7.4vw] font-extrabold leading-[1.2] tracking-[-0.03em] [word-spacing:0.12em] md:text-4xl lg:text-[2.55rem] xl:text-[2.9rem] min-[1920px]:text-[3.15rem]">
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
          </div>

          <aside className="min-w-0 lg:sticky lg:top-24">
            <div className="mb-8 flex gap-10 font-mono text-primary">
              <div>
                <div className="text-5xl font-extrabold xl:text-6xl">8+</div>
                <div className="text-[11px] text-text-secondary">{yearsIt}</div>
              </div>
              <div>
                <div className="text-5xl font-extrabold xl:text-6xl">5+</div>
                <div className="text-[11px] text-text-secondary">{yearsDev}</div>
              </div>
            </div>
            <img
              src="/profile-pic.jpeg"
              alt="Luka Vieira"
              className="h-56 w-full max-w-xs object-cover grayscale md:h-72 lg:max-w-none lg:h-[28rem] xl:h-[32rem]"
            />
          </aside>
        </div>
      </Shell>
    </section>
  );
}
