import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import type { IProject } from "../../types";
import { assert } from "../../lib/assert";
import { coreStacksOf } from "../../lib/coreStack";
import { GhostType } from "../GhostType";

interface Props {
  projects: IProject[];
}

/**
 * Selected Work — tipografia + capas fortes (vibe designedbyruss).
 * Não é sticky dossier nem reel 100vh.
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
    <section id="projects" className="relative pb-24 md:pb-40">
      <header className="mx-auto max-w-6xl px-5 pb-16 pt-24 md:px-10 md:pb-24 md:pt-32">
        <p className="font-mono text-sm text-primary">03.</p>
        <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-text-primary md:text-7xl">
          <GhostType text={t("projects.title")} />
        </h2>
        <p className="mt-6 max-w-md text-base text-text-secondary md:text-lg">
          {t("projects.craft")}
        </p>
      </header>

      <div className="mx-auto max-w-6xl px-5 md:px-10">
        {projects.map((project, index) => (
          <WorkRow
            key={project.title}
            project={project}
            index={index}
            reverse={index % 2 === 1}
            kindLabel={t(
              project.isPersonal
                ? "projects.kind.personal"
                : "projects.kind.professional",
            )}
          />
        ))}
      </div>
    </section>
  );
}

function WorkRow({
  project,
  index,
  reverse,
  kindLabel,
}: {
  project: IProject;
  index: number;
  reverse: boolean;
  kindLabel: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const stacks = coreStacksOf(project);
  assert(stacks.length > 0, `no core stacks on ${project.title}`);
  assert(kindLabel.length > 0, `empty kind for ${project.title}`);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.05]);
  const copyY = useTransform(scrollYProgress, [0, 1], [36, -24]);
  const copyOpacity = useTransform(scrollYProgress, [0.15, 0.4], [0.2, 1]);

  return (
    <article
      ref={ref}
      className="border-t border-text-primary/10 py-14 md:py-28"
    >
      <div
        className={`grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12 ${
          reverse ? "md:[direction:rtl]" : ""
        }`}
      >
        <motion.div
          style={{ y: copyY, opacity: copyOpacity }}
          className={`md:col-span-5 ${reverse ? "md:[direction:ltr]" : ""}`}
        >
          <p className="font-mono text-xs text-primary">
            {String(index + 1).padStart(2, "0")} · {kindLabel}
          </p>
          <h3 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-text-primary md:text-5xl">
            <a
              href={project.link || project.githubLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
            >
              {project.title}
            </a>
          </h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-text-secondary md:text-base">
            {project.description[0]}
          </p>
          <p className="mt-5 font-mono text-xs tracking-wide text-primary">
            {stacks.join(" · ")}
          </p>
          <div className="mt-4 flex gap-4">
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
        </motion.div>

        <div
          className={`relative md:col-span-7 ${reverse ? "md:[direction:ltr]" : ""}`}
        >
          <div className="relative aspect-[16/11] overflow-hidden bg-[#d7dee6] md:aspect-[16/10]">
            <motion.img
              src={project.image}
              alt={project.title}
              style={{ y: imageY, scale: imageScale }}
              className="absolute inset-0 h-[112%] w-full object-cover object-top will-change-transform"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
