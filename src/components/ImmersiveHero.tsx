import { lazy, Suspense, useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "../hooks/useGSAP";

gsap.registerPlugin(ScrollTrigger);
const ParticleField = lazy(() => import("./ParticleField"));

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

  useEffect(() => {
    const root = rootRef.current;
    const heading = nameRef.current;
    if (!root || !heading) return;

    const letters = heading.querySelectorAll("[data-letter]");
    if (!prefersReducedMotion) {
      letters.forEach((node, i) => {
        const el = node as HTMLElement;
        const final = el.dataset.letter || "";
        let frame = 0;
        const run = () => {
          frame += 1;
          if (frame < 10 + i * 2) {
            el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            requestAnimationFrame(run);
          } else {
            el.textContent = final;
          }
        };
        requestAnimationFrame(run);
      });

      gsap.fromTo(
        heading,
        { scale: 0.82, y: 40 },
        { scale: 1, y: 0, duration: 1, ease: "expo.out" },
      );

      gsap.fromTo(
        heading,
        { scale: 1, y: 0, filter: "blur(0px)" },
        {
          scale: 4.2,
          y: -80,
          filter: "blur(8px)",
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
            anticipatePin: 1,
          },
        },
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === root) st.kill();
      });
    };
  }, [name, prefersReducedMotion]);

  const display = name.replace(/\.$/, "");

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100dvh] min-w-0 items-end overflow-hidden px-5 pb-16 pt-24 md:px-12"
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_28%_42%,rgba(100,255,218,0.16),transparent_52%)]" />
      <Suspense fallback={null}>
        <ParticleField reduced={prefersReducedMotion} />
      </Suspense>
      <div className="relative z-10 min-w-0 w-full">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
          {mark}
        </p>
        <h1
          ref={nameRef}
          className="max-w-full text-[18vw] font-extrabold leading-[0.82] tracking-[-0.05em] text-text-primary md:text-[13vw]"
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
