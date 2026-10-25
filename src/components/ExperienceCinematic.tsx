import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import { useGSAP } from "../hooks/useGSAP";
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
      const year = scene.querySelector<HTMLElement>("[data-year]");
      const tick = scene.querySelector<HTMLElement>("[data-year-tick]");
      const title = scene.querySelector<HTMLElement>("[data-scramble]");
      const bits = scene.querySelectorAll("[data-assemble]");
      const targetYear = Number(scene.dataset.year || "0");

      if (year) {
        gsap.fromTo(
          year,
          { y: 90, x: 20, opacity: 0.06 },
          {
            y: -30,
            x: 0,
            opacity: 0.18,
            ease: "none",
            scrollTrigger: {
              trigger: scene,
              start: "top 92%",
              end: "bottom 18%",
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
        { y: 36 },
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

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger && root.contains(st.vars.trigger as Node)) st.kill();
      });
    };
  }, [experiences, prefersReducedMotion]);

  return (
    <section id="experience" ref={rootRef} className="relative min-w-0 overflow-x-clip px-5 py-16 md:px-12">
      <svg
        className="pointer-events-none absolute left-[18px] top-8 h-[calc(100%-4rem)] w-6 md:left-8"
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

      <div className="space-y-8 md:pl-8">
        {experiences.map((job) => {
          const year = yearOf(job.period);
          return (
            <article
              key={`${job.company}-${job.period}`}
              data-job-scene
              data-year={year}
              className="relative min-h-[88dvh] min-w-0 overflow-hidden pl-8 md:pl-12"
            >
              <span className="absolute left-0 top-7 h-3 w-3 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_18px_#64ffda]" />
              <div
                data-year
                className="pointer-events-none absolute -top-6 right-0 font-mono text-[20vw] font-extrabold leading-none text-primary md:text-[9rem]"
              >
                {year || ""}
              </div>
              <p data-assemble className="font-mono text-xs text-primary">
                <span data-year-tick>{year || ""}</span>
                <span> · {job.period}</span>
              </p>
              <h3
                data-assemble
                data-scramble={job.role}
                className="mt-3 max-w-[18rem] text-[1.85rem] font-extrabold leading-[1.05] text-text-primary md:max-w-xl md:text-5xl"
              >
                {job.role}
              </h3>
              <p data-assemble className="mt-2 text-lg text-primary">
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
              <div className="relative z-10 mt-5 max-w-2xl space-y-3 text-sm leading-relaxed text-text-secondary md:text-base">
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
            </article>
          );
        })}
      </div>
    </section>
  );
}
