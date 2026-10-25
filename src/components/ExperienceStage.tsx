import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import { useGSAP } from "../hooks/useGSAP";
import type { IExperience } from "../types";

gsap.registerPlugin(ScrollTrigger);

interface ExperienceStageProps {
  experiences: IExperience[];
  title: string;
}

export function ExperienceStage({ experiences, title }: ExperienceStageProps) {
  const pinRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { prefersReducedMotion } = useGSAP();
  const { t } = useTranslation();
  const job = experiences[active] ?? experiences[0];

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin || prefersReducedMotion) return;

    const sync = () => {
      const rect = pin.getBoundingClientRect();
      const total = pin.offsetHeight - window.innerHeight;
      const progress = total <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / total));
      const next = Math.min(
        experiences.length - 1,
        Math.floor(progress * experiences.length + 0.001),
      );
      setActive(next);
      if (lineRef.current) {
        lineRef.current.style.transform = `scaleY(${progress})`;
      }
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    const trigger = ScrollTrigger.create({
      trigger: pin,
      start: "top top",
      end: "bottom bottom",
      onUpdate: sync,
    });

    return () => {
      window.removeEventListener("scroll", sync);
      trigger.kill();
    };
  }, [experiences.length, prefersReducedMotion]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || prefersReducedMotion) return;
    const bits = card.querySelectorAll("[data-job]");
    gsap.fromTo(
      bits,
      { y: 12 },
      { y: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" },
    );
  }, [active, prefersReducedMotion]);

  const list = prefersReducedMotion ? experiences : [job];

  return (
    <section id="experience" className="min-w-0">
      <div
        ref={pinRef}
        style={{
          height: prefersReducedMotion
            ? "auto"
            : `${Math.max(experiences.length, 1) * 100}vh`,
        }}
      >
        <div className="sticky top-0 flex min-h-[100dvh] min-w-0 flex-col justify-center overflow-hidden px-5 py-20 md:px-10">
          <p className="font-mono text-xs text-primary">02.</p>
          <h2 className="mb-6 text-3xl font-extrabold text-text-primary md:text-4xl">
            {title}
          </h2>

          <div className="relative min-w-0">
            <div className="absolute bottom-4 left-[7px] top-4 w-px bg-primary/15" />
            <div
              ref={lineRef}
              className="glow-line absolute left-[7px] top-4 w-px origin-top bg-primary"
              style={{ height: "calc(100% - 2rem)", transform: "scaleY(0)" }}
            />

            <div className="space-y-3 pl-7">
              {prefersReducedMotion ? (
                experiences.map((item) => (
                  <JobCard key={item.period} job={item} seeMore={t("experience.seeMore")} />
                ))
              ) : (
                <div ref={cardRef}>
                  <JobCard job={job} seeMore={t("experience.seeMore")} />
                </div>
              )}
            </div>
          </div>

          {!prefersReducedMotion && (
            <div className="mt-6 flex flex-wrap gap-2">
              {experiences.map((item, i) => (
                <span
                  key={item.period}
                  className={`h-1.5 w-8 rounded-full ${
                    i === active ? "bg-primary" : "bg-primary/20"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function JobCard({ job, seeMore }: { job: IExperience; seeMore: string }) {
  return (
    <article className="term-window min-w-0 rounded-md p-4 md:p-5">
      <p data-job className="font-mono text-[11px] text-primary">
        {job.period}
      </p>
      <h3 data-job className="mt-1 text-xl font-bold text-text-primary">
        {job.role}
      </h3>
      <p data-job className="text-sm text-primary">
        @ {job.company}
      </p>
      {job.link && (
        <a
          data-job
          href={job.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block font-mono text-xs text-primary"
        >
          {seeMore} →
        </a>
      )}
      <div className="mt-3 max-h-[34vh] min-w-0 space-y-2 overflow-y-auto pr-1 text-sm leading-relaxed text-text-secondary">
        {job.description.map((p) => (
          <p data-job key={p.slice(0, 28)}>
            {p}
          </p>
        ))}
      </div>
      <ul className="mt-3 flex min-w-0 flex-wrap gap-1.5">
        {job.technologies.map((tech) => (
          <li
            key={tech}
            data-job
            className="rounded-sm border border-primary/20 px-2 py-0.5 font-mono text-[10px]"
          >
            {tech}
          </li>
        ))}
      </ul>
    </article>
  );
}
