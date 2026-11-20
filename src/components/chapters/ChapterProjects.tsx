import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import type { IProject } from "../../types";
import { assert } from "../../lib/assert";

interface Props {
  projects: IProject[];
}

export function ChapterProjects({ projects }: Props) {
  assert(projects.length > 0, "projects required");
  projects.forEach((p) => {
    assert(
      typeof p.image === "string" && p.image.length > 0,
      `missing image: ${p.title}`,
    );
  });

  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const count = projects.length;
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(count - 1, Math.max(0, Math.floor(v * count)));
    setActive(idx);
  });

  return (
    <section
      id="projects"
      ref={ref}
      className="relative"
      style={{ height: `${count * 100}vh` }}
    >
      <div className="sticky top-0 flex h-[100svh] items-stretch overflow-hidden md:items-center">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 content-start gap-3 px-5 pt-20 pb-8 md:grid-cols-12 md:content-center md:gap-10 md:px-10 md:py-0">
          <div className="relative z-20 md:col-span-4">
            <p className="font-mono text-sm text-primary">03.</p>
            <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-text-primary md:mt-2 md:text-5xl">
              {t("projects.title")}
            </h2>
            <p className="mt-2 hidden max-w-sm text-sm text-text-secondary md:mt-3 md:block">
              {t("projects.hint")}
            </p>

            <div className="mt-6 hidden space-y-2 md:block">
              {projects.map((project, i) => (
                <div
                  key={project.title}
                  className={`flex items-baseline gap-3 transition-opacity ${
                    i === active ? "opacity-100" : "opacity-35"
                  }`}
                >
                  <span className="font-mono text-xs text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate text-sm text-text-primary">
                    {project.title}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-2 font-mono text-xs text-primary md:hidden">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(count).padStart(2, "0")}
            </p>
          </div>

          <div className="relative min-h-0 md:col-span-8 md:h-[78vh]">
            {projects.map((project, i) => (
              <ProjectPanel
                key={project.title}
                project={project}
                index={i}
                active={active === i}
                personalLabel={t("projects.filters.personal")}
                professionalLabel={t("projects.filters.professional")}
              />
            ))}
          </div>
        </div>

        <motion.div
          className="pointer-events-none absolute bottom-4 left-5 right-5 h-px origin-left bg-primary md:bottom-8 md:left-10 md:right-10"
          style={{ scaleX: scrollYProgress }}
        />
      </div>
    </section>
  );
}

function ProjectPanel({
  project,
  index,
  active,
  personalLabel,
  professionalLabel,
}: {
  project: IProject;
  index: number;
  active: boolean;
  personalLabel: string;
  professionalLabel: string;
}) {
  return (
    <motion.article
      initial={false}
      animate={
        active
          ? { opacity: 1, y: 0, visibility: "visible" as const }
          : { opacity: 0, y: 24, visibility: "hidden" as const }
      }
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute inset-0 flex flex-col justify-start gap-3 md:justify-center md:gap-5 ${
        active ? "pointer-events-auto z-10" : "pointer-events-none z-0"
      }`}
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-background-lighter md:aspect-[16/9]">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover object-top"
        />
      </div>

      <div className="min-w-0 shrink bg-background/90 backdrop-blur-[2px]">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-mono text-xs text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-display text-xl font-bold text-text-primary md:text-4xl">
            {project.title}
          </h3>
          <div className="flex gap-3">
            {project.githubLink && project.isPersonal && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-primary transition-colors hover:text-primary"
              >
                <FiGithub size={18} />
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-primary transition-colors hover:text-primary"
              >
                <FiExternalLink size={18} />
              </a>
            )}
          </div>
        </div>

        <p className="mt-1 font-mono text-xs text-primary">
          {project.isPersonal ? personalLabel : professionalLabel}
        </p>

        <p className="mt-2 text-sm leading-relaxed text-text-secondary md:mt-3 md:text-base">
          {project.description[0]}
        </p>

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-text-secondary md:mt-4 md:text-xs">
          {project.technologies.slice(0, 6).map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
