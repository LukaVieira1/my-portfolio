import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
    assert(typeof p.image === "string" && p.image.length > 0, `missing image: ${p.title}`);
  });

  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const slides = projects.length;
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `-${(slides - 1) * 100}vw`],
  );

  return (
    <section
      id="projects"
      ref={ref}
      className="relative"
      style={{ height: `${Math.max(slides, 2) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute left-6 top-24 z-20 md:left-10">
          <p className="font-mono text-sm text-primary">03.</p>
          <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-text-primary md:text-5xl">
            {t("projects.title")}
          </h2>
          <p className="mt-3 max-w-sm text-sm text-text-secondary">
            {t("projects.hint")}
          </p>
        </div>

        <motion.div style={{ x }} className="flex h-full w-max items-center">
          {projects.map((project, i) => (
            <ProjectFrame
              key={project.title}
              project={project}
              index={i}
              total={slides}
              progress={scrollYProgress}
            />
          ))}
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-6 right-6 h-px origin-left bg-primary md:left-10 md:right-10"
          style={{ scaleX: scrollYProgress }}
        />
      </div>
    </section>
  );
}

function ProjectFrame({
  project,
  index,
  total,
  progress,
}: {
  project: IProject;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(
    progress,
    [start - 0.05, start + 0.05, end - 0.05, end + 0.05],
    [0.35, 1, 1, 0.35],
  );

  return (
    <motion.article
      style={{ opacity }}
      className="flex h-full w-screen shrink-0 items-center px-6 pt-28 md:px-10"
    >
      <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-end md:min-h-[70vh]">
        <div className="absolute inset-x-0 top-8 bottom-28 overflow-hidden md:top-4 md:bottom-24">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
        </div>

        <div className="relative z-10 max-w-2xl pb-4">
          <span className="font-display text-6xl font-extrabold text-primary/30 md:text-7xl">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="mt-2 flex items-center gap-3">
            <h3 className="font-display text-3xl font-bold text-text-primary md:text-5xl">
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
                  <FiGithub size={20} />
                </a>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-primary transition-colors hover:text-primary"
                >
                  <FiExternalLink size={20} />
                </a>
              )}
            </div>
          </div>

          <p className="mt-2 font-mono text-xs text-primary">
            {project.isPersonal ? "pessoal" : "profissional"}
          </p>

          <p className="mt-4 max-w-xl text-text-secondary leading-relaxed">
            {project.description[0]}
          </p>

          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs text-text-secondary">
            {project.technologies.slice(0, 6).map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
