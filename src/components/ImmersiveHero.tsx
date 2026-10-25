import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "../hooks/useGSAP";
import { HeroBackdrop } from "./HeroBackdrop";

gsap.registerPlugin(ScrollTrigger);

interface ImmersiveHeroProps {
  name: string;
  description: string;
  mark: string;
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function ImmersiveHero({ name, description, mark }: ImmersiveHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const { prefersReducedMotion } = useGSAP();
  const display = name.replace(/\.$/, "");

  useEffect(() => {
    const root = rootRef.current;
    const heading = nameRef.current;
    if (!root || !heading || prefersReducedMotion) return;

    const letters = heading.querySelectorAll("[data-letter]");
    letters.forEach((node, i) => {
      const el = node as HTMLElement;
      const final = el.dataset.letter || el.textContent || "";
      let frame = 0;
      const run = () => {
        frame += 1;
        if (frame < 10 + i * 2) {
          el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)] || final;
          requestAnimationFrame(run);
        } else {
          el.textContent = final;
        }
      };
      requestAnimationFrame(run);
    });

    const ios = /iP(hone|ad|od)/.test(navigator.userAgent);
    let st: ScrollTrigger | undefined;
    let frames = 0;
    const start = () => {
      frames += 1;
      if (root.offsetHeight < 160 && frames < 20) {
        requestAnimationFrame(start);
        return;
      }
      if (root.offsetHeight < 160) return;
      st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (root.offsetHeight < 160) {
            heading.style.transform = "";
            heading.style.filter = "";
            return;
          }
          const p = self.progress;
          heading.style.transform = `translate3d(0, ${-72 * p}px, 0) scale(${1 + p * 2.2})`;
          heading.style.filter = !ios && p > 0.1 ? `blur(${7 * p}px)` : "none";
        },
      });
      ScrollTrigger.refresh();
    };
    const raf = requestAnimationFrame(start);

    return () => {
      cancelAnimationFrame(raf);
      st?.kill();
      heading.style.transform = "";
      heading.style.filter = "";
      letters.forEach((node) => {
        const el = node as HTMLElement;
        el.textContent = el.dataset.letter || el.textContent;
      });
    };
  }, [name, prefersReducedMotion]);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100dvh] min-w-0 items-end overflow-hidden px-5 pb-16 pt-24 md:px-12"
    >
      <HeroBackdrop reduced={prefersReducedMotion} />
      <div className="relative z-10 min-w-0 w-full">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
          {mark}
        </p>
        <h1
          ref={nameRef}
          className="max-w-full origin-bottom-left text-[18vw] font-extrabold leading-[0.82] tracking-[-0.05em] text-text-primary md:text-[13vw]"
        >
          {display.split("").map((ch, i) =>
            ch === " " ? (
              <br key={`br-${i}`} />
            ) : (
              <span key={`${ch}-${i}`} data-letter={ch} className="inline-block">
                {ch}
              </span>
            ),
          )}
        </h1>
        <p className="mt-8 max-w-md text-sm leading-relaxed text-text-secondary md:text-base">
          {description}
        </p>
      </div>
    </section>
  );
}
