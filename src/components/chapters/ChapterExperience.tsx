import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { IExperience } from "../../types";
import { assert } from "../../lib/assert";

interface Props {
  experiences: IExperience[];
}

function yearFromPeriod(period: string): string {
  const match = period.match(/\d{4}/);
  assert(match != null, `period without year: ${period}`);
  return match[0];
}

export function ChapterExperience({ experiences }: Props) {
  assert(experiences.length > 0, "experiences required");

  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const count = experiences.length;
  const heightVh = count * 100;

  const years = useMemo(
    () => experiences.map((e) => yearFromPeriod(e.period)),
    [experiences],
  );

  return (
    <section
      id="experience"
      ref={ref}
      className="relative"
      style={{ height: `${heightVh}vh` }}
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-5 md:grid-cols-12 md:gap-8 md:px-10">
          <div className="md:col-span-4">
            <p className="font-mono text-sm text-primary">02.</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-text-primary md:text-5xl">
              {t("experience.title")}
            </h2>
            <div className="mt-6 hidden space-y-3 md:mt-10 md:block">
              {experiences.map((exp, i) => (
                <ExperienceTick
                  key={`${exp.company}-${exp.period}`}
                  index={i}
                  label={exp.company}
                  year={years[i]}
                  progress={scrollYProgress}
                  count={count}
                />
              ))}
            </div>
          </div>

          <div className="relative min-h-[58vh] md:col-span-8 md:min-h-0 md:h-[70vh]">
            {experiences.map((exp, i) => (
              <ExperiencePanel
                key={`${exp.company}-panel`}
                experience={exp}
                year={years[i]}
                index={i}
                progress={scrollYProgress}
                count={count}
                seeMore={t("experience.seeMore")}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceTick({
  index,
  label,
  year,
  progress,
  count,
}: {
  index: number;
  label: string;
  year: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  count: number;
}) {
  const start = index / count;
  const end = (index + 1) / count;
  const opacity = useTransform(progress, [start, start + 0.02, end - 0.02, end], [0.35, 1, 1, 0.35]);
  const x = useTransform(progress, [start, start + 0.02, end - 0.02, end], [8, 0, 0, 8]);

  return (
    <motion.div style={{ opacity, x }} className="flex items-baseline gap-3">
      <span className="font-mono text-xs text-primary">{year}</span>
      <span className="truncate text-sm text-text-primary">{label}</span>
    </motion.div>
  );
}

function ExperiencePanel({
  experience,
  year,
  index,
  progress,
  count,
  seeMore,
}: {
  experience: IExperience;
  year: string;
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  count: number;
  seeMore: string;
}) {
  const start = index / count;
  const mid = (index + 0.5) / count;
  const end = (index + 1) / count;

  const opacity = useTransform(
    progress,
    [start, start + 0.08, end - 0.08, end],
    [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, mid, end], [48, 0, -48]);
  const watermarkX = useTransform(progress, [start, end], ["8%", "-4%"]);

  return (
    <motion.article
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col justify-center overflow-y-auto overscroll-contain pr-1"
    >
      <motion.span
        style={{ x: watermarkX }}
        className="pointer-events-none absolute -top-2 right-0 hidden font-display text-[7rem] font-extrabold leading-none text-text-primary/8 md:block md:-top-6 md:text-[10rem]"
        aria-hidden
      >
        {year}
      </motion.span>

      <p className="font-mono text-xs text-primary md:text-sm">{experience.period}</p>
      <h3 className="mt-2 max-w-2xl font-display text-xl font-bold text-text-primary md:text-4xl">
        {experience.role}
        <span className="text-primary"> @ {experience.company}</span>
      </h3>

      <div className="mt-4 max-w-xl space-y-2 text-sm text-text-secondary md:mt-6 md:space-y-3 md:text-base">
        {experience.description.slice(0, 2).map((p, i) => (
          <p key={i} className="leading-relaxed">
            {p}
          </p>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-text-secondary md:mt-6 md:gap-x-4 md:gap-y-2 md:text-xs">
        {experience.technologies.map((tech) => (
          <span key={tech} className="before:mr-1 before:text-primary before:content-['▹']">
            {tech}
          </span>
        ))}
      </div>

      {experience.link && (
        <a
          href={experience.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-fit font-mono text-sm text-primary transition-opacity hover:opacity-70 md:mt-8"
        >
          {seeMore} →
        </a>
      )}
    </motion.article>
  );
}
