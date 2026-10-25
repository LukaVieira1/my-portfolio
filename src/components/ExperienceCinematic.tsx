import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import { useGSAP } from "../hooks/useGSAP";
import { Shell } from "./Shell";
import type { IExperience } from "../types";

gsap.registerPlugin(ScrollTrigger);

interface ExperienceCinematicProps {
  experiences: IExperience[];
}

function yearOf(period: string) {
  const match = period.match(/\d{4}/);
  return match ? Number(match[0]) : 0;
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function scrambleText(el: HTMLElement, final: string) {
  let frame = 0;
  const run = () => {
    frame += 1;
    if (frame < 14) {
      el.textContent = final
        .split("")
        .map((ch) => (ch === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
        .join("");
      requestAnimationFrame(run);
    } else {
      el.textContent = final;
    }
  };
  requestAnimationFrame(run);
}

export function ExperienceCinematic({ experiences }: ExperienceCinematicProps) {
  const rootRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const { prefersReducedMotion } = useGSAP();
  const { t } = useTranslation();

  useEffect(() => {
    const root = rootRef.current;
    const path = pathRef.current;
    if (!root || prefersReducedMotion) return;
    try {
      if (path) {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.5,
          },
        });
      }

      root.querySelectorAll<HTMLElement>("[data-job-scene]").forEach((scene) => {
        const years = scene.querySelectorAll<HTMLElement>("[data-year]");
        const tick = scene.querySelector<HTMLElement>("[data-year-tick]");
        const title = scene.querySelector<HTMLElement>("[data-scramble]");
        const bits = scene.querySelectorAll("[data-assemble]");
        const targetYear = Number(scene.dataset.year || "0");

        if (years.length) {
          gsap.fromTo(
            years,
            { y: 50 },
            {
              y: -24,
              ease: "none",
              scrollTrigger: {
                trigger: scene,
                start: "top 90%",
                end: "bottom 20%",
                scrub: 0.7,
              },
            },
          );
        }

        if (tick) {
          const counter = { n: Math.max(2016, targetYear - 6) };
          gsap.to(counter, {
            n: targetYear,
            ease: "none",
            scrollTrigger: {
              trigger: scene,
              start: "top 82%",
              end: "top 42%",
              scrub: 0.4,
            },
            onUpdate: () => {
              tick.textContent = String(Math.round(counter.n));
            },
          });
        }

        if (title) {
          const final = title.dataset.scramble || title.textContent || "";
          ScrollTrigger.create({
            trigger: scene,
            start: "top 72%",
            once: true,
            onEnter: () => scrambleText(title, final),
          });
        }

        gsap.fromTo(
          bits,
          { y: 28 },
          {
            y: 0,
            stagger: 0.05,
            ease: "none",
            scrollTrigger: {
              trigger: scene,
              start: "top 78%",
              end: "top 36%",
              scrub: 0.45,
            },
          },
        );
      });
    } catch {
      return;
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        const trigger = st.vars.trigger;
        if (trigger instanceof Node && root.contains(trigger)) st.kill();
      });
    };
  }, [experiences, prefersReducedMotion]);

  return (
    <section id="experience" ref={rootRef} className="relative min-w-0 overflow-x-clip py-16 md:py-24">
      <svg
        className="pointer-events-none absolute left-[18px] top-8 h-[calc(100%-4rem)] w-6 lg:hidden"
        viewBox="0 0 24 1200"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          ref={pathRef}
          d="M12 0 C12 90, 4 150, 12 240 S20 390, 12 480 S4 660, 12 780 S20 990, 12 1200"
          fill="none"
          stroke="#64ffda"
          strokeWidth="2"
        />
      </svg>

      <Shell>
        <div className="space-y-8 lg:space-y-0">
          {experiences.map((job) => {
            const year = yearOf(job.period);
            return (
              <article
                key={`${job.company}-${job.period}`}
                data-job-scene
                data-year={year}
                className="relative grid min-h-[88dvh] min-w-0 items-center gap-6 overflow-hidden pl-8 lg:min-h-[80dvh] lg:grid-cols-[minmax(260px,0.4fr)_1fr] lg:gap-16 lg:overflow-visible lg:pl-0 xl:gap-20 min-[1400px]:min-h-[70dvh]"
              >
                <span className="absolute left-0 top-7 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-primary lg:hidden" />
                <div
                  data-year
                  className="pointer-events-none absolute -top-6 right-0 font-mono text-[20vw] font-extrabold leading-none text-primary/25 lg:hidden"
                >
                  {year || ""}
                </div>

                <div className="hidden min-w-0 lg:block">
                  <div
                    data-year
                    className="font-mono text-[7rem] font-extrabold leading-none text-primary/50 xl:text-[9rem] min-[1920px]:text-[10.5rem]"
                  >
                    {year || ""}
                  </div>
                  <p data-assemble className="mt-4 max-w-sm text-2xl font-semibold text-primary xl:text-3xl">
                    {job.company}
                  </p>
                </div>

                <div className="relative min-w-0 lg:border-l-2 lg:border-primary/70 lg:pl-12 xl:pl-16">
                  <span className="absolute left-0 top-3 hidden h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-primary lg:block" />
                  <p data-assemble className="font-mono text-xs text-primary">
                    <span data-year-tick>{year || ""}</span>
                    <span> · {job.period}</span>
                  </p>
                  <h3
                    data-assemble
                    data-scramble={job.role}
                    className="mt-3 max-w-[18rem] text-[1.85rem] font-extrabold leading-[1.05] text-text-primary md:max-w-3xl md:text-5xl xl:text-6xl"
                  >
                    {job.role}
                  </h3>
                  <p data-assemble className="mt-2 text-lg text-primary lg:hidden">
                    {job.company}
                  </p>
                  {job.link && (
                    <a
                      data-assemble
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block font-mono text-xs text-primary"
                    >
                      {t("experience.seeMore")} →
                    </a>
                  )}
                  <div className="relative z-10 mt-5 max-w-3xl space-y-3 text-sm leading-relaxed text-text-secondary md:text-base xl:max-w-4xl xl:text-lg">
                    {job.description.map((p) => (
                      <p data-assemble key={p.slice(0, 32)}>
                        {p}
                      </p>
                    ))}
                  </div>
                  <ul className="mt-4 flex min-w-0 flex-wrap gap-2">
                    {job.technologies.map((tech) => (
                      <li
                        key={tech}
                        data-assemble
                        className="rounded-full border border-primary/20 px-2 py-1 font-mono text-[11px]"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </Shell>
    </section>
  );
}
