import { useEffect, useRef } from "react";
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
  onImmersiveChange?: (immersive: boolean) => void;
}

/**
 * Reels cinematográficos — mídia com inset (fora da nav do site)
 * + legenda sólida. Kind vem do próprio projeto (não do filtro plural).
 */
export function ChapterProjects({ projects, onImmersiveChange }: Props) {
  assert(projects.length > 0, "projects required");
  projects.forEach((p) => {
    assert(
      typeof p.image === "string" && p.image.length > 0,
      `missing image: ${p.title}`,
    );
  });

  const { t } = useTranslation();
  const reelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!onImmersiveChange) return;
    const root = reelsRef.current;
    assert(root != null, "reels root missing");

    const articles = [...root.querySelectorAll("article")];
    assert(articles.length === projects.length, "reel count mismatch");

    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        onImmersiveChange(visible.size > 0);
      },
      { threshold: 0.35 },
    );

    articles.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      onImmersiveChange(false);
    };
  }, [onImmersiveChange, projects.length]);

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

      <div ref={reelsRef} className="flex flex-col gap-8 md:gap-12">
        {projects.map((project, index) => {
          const kindKey = project.isPersonal
            ? "projects.kind.personal"
            : "projects.kind.professional";
          const kindLabel = t(kindKey);
          assert(
            kindLabel.length > 0 && !kindLabel.startsWith("projects."),
            `missing i18n kind for ${project.title}`,
          );
          assert(
            project.isPersonal === (kindKey === "projects.kind.personal"),
            `kind/isPersonal mismatch for ${project.title}`,
          );

          return (
            <ProjectReel
              key={project.title}
              project={project}
              index={index}
              kindLabel={kindLabel}
            />
          );
        })}
      </div>
    </section>
  );
}

function ProjectReel({
  project,
  index,
  kindLabel,
}: {
  project: IProject;
  index: number;
  kindLabel: string;
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

  const mediaY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const mediaScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.03, 1.1]);
  const captionOpacity = useTransform(scrollYProgress, [0.12, 0.35], [0.4, 1]);

  return (
    <article
      ref={ref}
      className="relative mx-auto flex h-[100svh] w-full max-w-[100vw] flex-col overflow-hidden"
    >
      {/*
        Inset do stage: respira sob a nav e nas laterais —
        o chrome do portfolio não senta no UI do produto.
      */}
      <div className="relative min-h-0 flex-1 px-4 pt-4 md:px-10 md:pt-6">
        <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#d7dee6] shadow-[0_0_0_1px_rgba(26,35,50,0.08)] dark:bg-background-lighter">
          <motion.img
            src={project.image}
            alt={project.title}
            style={{ y: mediaY, scale: mediaScale }}
            className="max-h-full max-w-full object-contain will-change-transform"
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
          <span className="pointer-events-none absolute bottom-3 left-3 font-display text-5xl font-extrabold text-text-primary/15 md:bottom-4 md:left-5 md:text-7xl">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      <motion.div
        style={{ opacity: captionOpacity }}
        className="relative z-10 shrink-0 bg-background px-5 py-4 md:px-10 md:py-6"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-2.5 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="min-w-0 max-w-2xl">
            <p className="font-mono text-xs text-primary">
              {String(index + 1).padStart(2, "0")} · {kindLabel}
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
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-secondary md:text-base">
              {project.description[0]}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2 font-mono text-xs md:justify-end md:pb-1">
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
      className="mx-auto mt-3 h-px max-w-6xl origin-left bg-primary md:mt-4"
      style={{ scaleX }}
    />
  );
}
