import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "../hooks/useGSAP";
import { Shell } from "./Shell";
import { motion } from "../motion";

gsap.registerPlugin(ScrollTrigger);

interface ImmersiveHeroProps {
  name: string;
  description: string;
  mark: string;
}

export function ImmersiveHero({ name, description, mark }: ImmersiveHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const shiftRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = useGSAP();
  const display = name.replace(/\.$/, "");

  useEffect(() => {
    const root = rootRef.current;
    const heading = nameRef.current;
    const shift = shiftRef.current;
    const line = lineRef.current;
    if (!root || !heading) return;

    const letters = heading.querySelectorAll<HTMLElement>("[data-letter]");
    if (!prefersReducedMotion) {
      gsap.fromTo(
        letters,
        { y: 18 },
        { y: 0, duration: motion.hero, ease: motion.easeOut, stagger: 0.028, overwrite: true },
      );
    }

    const onPointer = (e: PointerEvent) => {
      if (window.matchMedia("(pointer: coarse)").matches) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 16;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      if (shift) shift.style.transform = `translate3d(${x * 0.35}px, ${y * 0.25}px, 0)`;
      if (line) line.style.transform = `translate3d(${x * -0.5}px, ${y * 0.4}px, 0)`;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let st: ScrollTrigger | undefined;
    const start = () => {
      if (root.offsetHeight < 160) return;
      st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: 0.55,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          heading.style.transform = `translate3d(0, ${-48 * p}px, 0) scale(${1 + p * 0.18})`;
        },
      });
    };
    const raf = requestAnimationFrame(start);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      st?.kill();
      heading.style.transform = "";
      if (shift) shift.style.transform = "";
    };
  }, [name, prefersReducedMotion]);

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative flex min-h-[100dvh] min-w-0 items-end overflow-hidden pb-16 pt-28"
    >
      <div
        ref={lineRef}
        className="pointer-events-none absolute right-[8%] top-[22%] hidden h-[46vh] w-px bg-text-primary/20 md:block"
        aria-hidden
      />
      <Shell className="relative z-10 flex w-full flex-col justify-end xl:flex-row xl:items-end xl:justify-between xl:gap-20">
        <div className="min-w-0 flex-1">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
            {mark}
          </p>
          <div ref={shiftRef}>
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
        </div>
        <p className="mt-8 max-w-md text-sm leading-relaxed text-text-secondary md:text-base xl:mb-4 xl:mt-0 xl:max-w-md xl:text-xl xl:leading-snug min-[1920px]:max-w-lg min-[1920px]:text-3xl min-[3000px]:max-w-xl min-[3000px]:text-4xl">
          {description}
        </p>
      </Shell>
    </section>
  );
}
