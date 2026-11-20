import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import type { IProject } from "../../types";
import { assert } from "../../lib/assert";
import { coreStacksOf } from "../../lib/coreStack";

interface Props {
  projects: IProject[];
}

/**
 * Projetos = reels cinematográficos empilhados.
 * Mecânica: scroll natural + parallax na mídia (não sticky dossier).
 * Cada reel = stage de mídia + barra sólida de legenda (sem texto sobre a arte).
 */
export function ChapterProjects({ projects }: Props) {
  assert(projects.length > 0, "projects required");
  projects.forEach((p) => {
    assert(
      typeof p.image === "string" && p.image.length > 0,
      `missing image: ${p.title}`,
    );
  });

  const { t } = useTranslation();

  return (
    <section id="projects" className="relative">
      <header className="mx-auto max-w-6xl px-5 pb-8 pt-24 md:px-10 md:pb-12 md:pt-32">
        <p className="font-mono text-sm text-primary">03.</p>
        <h2 className="mt-2 max-w-3xl font-display text-3xl font-extrabold tracking-tight text-text-primary md:text-6xl">
          {t("projects.title")}
        </h2>
        <p className="mt-4 max-w-lg text-sm text-text-secondary md:text-base">
          {t("projects.hint")}
        </p>
      </header>

      <div className="flex flex-col gap-6 md:gap-10">
        {projects.map((project, index) => (
          <ProjectReel
            key={project.title}
            project={project}
            index={index}
            personalLabel={t("projects.filters.personal")}
            professionalLabel={t("projects.filters.professional")}
          />
        ))}
      </div>
    </section>
  );
}

function ProjectReel({
  project,
  index,
  personalLabel,
  professionalLabel,
}: {
  project: IProject;
  index: number;
  personalLabel: string;
  professionalLabel: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const stacks = coreStacksOf(project);
  assert(
    stacks.length > 0,
    `project "${project.title}" entered core narrative without core tags`,
  );

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const mediaY = useTransform(scrollYProgress, [0, 1], ["-16%", "16%"]);
  const mediaScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1.06, 1.16]);
  const captionY = useTransform(scrollYProgress, [0.2, 0.45], [28, 0]);
  const captionOpacity = useTransform(scrollYProgress, [0.15, 0.4], [0.35, 1]);
  const indexX = useTransform(scrollYProgress, [0, 1], ["-4%", "8%"]);

  return (
    <article
      ref={ref}
      className="relative mx-auto flex h-[100svh] w-full max-w-[100vw] flex-col overflow-hidden"
    >
      {/* Stage de mídia — só esta área, não vaza pro próximo reel */}
      <div className="relative min-h-0 flex-1 overflow-hidden bg-background-lighter">
        <motion.img
          src={project.image}
          alt={project.title}
          style={{ y: mediaY, scale: mediaScale }}
          className="absolute inset-0 h-[125%] w-full object-cover object-top will-change-transform"
        />
        <motion.span
          style={{ x: indexX }}
          className="pointer-events-none absolute bottom-4 left-5 font-display text-7xl font-extrabold text-background/70 md:bottom-6 md:left-10 md:text-8xl"
          aria-hidden
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>
      </div>

      {/* Legenda sólida — composição tipo reel, não dossier */}
      <motion.div
        style={{ y: captionY, opacity: captionOpacity }}
        className="relative z-10 shrink-0 border-t border-primary/25 bg-background px-5 py-5 md:px-10 md:py-7"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="min-w-0 max-w-2xl">
            <p className="font-mono text-xs text-primary">
              {String(index + 1).padStart(2, "0")} ·{" "}
              {project.isPersonal ? personalLabel : professionalLabel}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h3 className="font-display text-2xl font-bold text-text-primary md:text-4xl">
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
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-secondary md:line-clamp-2 md:text-base">
              {project.description[0]}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2 font-mono text-xs md:pb-1 md:justify-end">
            {stacks.map((stack) => (
              <span
                key={stack}
                className="border border-primary px-2.5 py-1 text-primary"
              >
                {stack}
              </span>
            ))}
          </div>
        </div>
        <BandScrub progress={scrollYProgress} />
      </motion.div>
    </article>
  );
}

function BandScrub({ progress }: { progress: MotionValue<number> }) {
  const scaleX = useTransform(progress, [0.2, 0.8], [0, 1]);
  return (
    <motion.div
      className="mx-auto mt-4 h-px max-w-6xl origin-left bg-primary"
      style={{ scaleX }}
    />
  );
}
