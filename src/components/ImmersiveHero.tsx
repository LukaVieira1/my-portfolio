import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "../hooks/useGSAP";
import { HeroBackdrop } from "./HeroBackdrop";
import { Shell } from "./Shell";

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
      className="relative flex min-h-[100dvh] min-w-0 items-end overflow-hidden pb-16 pt-24"
    >
      <HeroBackdrop reduced={prefersReducedMotion} />
      <Shell className="relative z-10 flex w-full flex-col justify-end xl:flex-row xl:items-end xl:justify-between xl:gap-20">
        <div className="min-w-0 flex-1">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
            {mark}
          </p>
          <h1
            ref={nameRef}
            className="max-w-full origin-bottom-left text-[18vw] font-extrabold leading-[0.82] tracking-[-0.05em] text-text-primary md:text-[11vw] lg:text-[9.4vw] min-[1920px]:text-[9vw]"
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
        </div>
        <p className="mt-8 max-w-md text-sm leading-relaxed text-text-secondary md:text-base xl:mb-4 xl:mt-0 xl:max-w-md xl:text-xl xl:leading-snug min-[1920px]:max-w-lg min-[1920px]:text-3xl min-[3000px]:max-w-xl min-[3000px]:text-4xl">
          {description}
        </p>
      </Shell>
    </section>
  );
}
