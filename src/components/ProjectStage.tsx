import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "../hooks/useGSAP";
import type { IProject } from "../types";

gsap.registerPlugin(ScrollTrigger);

interface ProjectStageProps {
  projects: IProject[];
  title: string;
  professionalLabel: string;
  personalLabel: string;
}

export function ProjectStage({
  projects,
  title,
  professionalLabel,
  personalLabel,
}: ProjectStageProps) {
  const [kind, setKind] = useState<"pro" | "personal">("pro");
  const filtered = projects.filter((p) =>
    kind === "personal" ? p.isPersonal : !p.isPersonal,
  );
  const pinRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { prefersReducedMotion } = useGSAP();
  const project = filtered[Math.min(active, Math.max(filtered.length - 1, 0))];

  useEffect(() => {
    setActive(0);
  }, [kind]);

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin || prefersReducedMotion || filtered.length === 0) return;

    const sync = () => {
      const rect = pin.getBoundingClientRect();
      const total = pin.offsetHeight - window.innerHeight;
      const progress = total <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / total));
      const next = Math.min(
        filtered.length - 1,
        Math.floor(progress * filtered.length + 0.001),
      );
      setActive(next);
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
  }, [filtered.length, prefersReducedMotion, kind]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || prefersReducedMotion) return;
    gsap.fromTo(
      frame,
      { y: 16 },
      { y: 0, duration: 0.35, ease: "power2.out" },
    );
  }, [active, kind, prefersReducedMotion]);

  return (
    <section id="projects" className="min-w-0">
      <div
        ref={pinRef}
        style={{
          height: prefersReducedMotion
            ? "auto"
            : `${Math.max(filtered.length, 1) * 90}vh`,
        }}
      >
        <div className="sticky top-0 flex min-h-[100dvh] min-w-0 flex-col justify-center overflow-hidden px-5 py-20 md:px-10">
          <p className="font-mono text-xs text-primary">03.</p>
          <h2 className="mb-5 text-3xl font-extrabold text-text-primary md:text-4xl">
            {title}
          </h2>

          <div className="mb-5 inline-flex rounded-sm border border-primary/25 p-1 font-mono text-xs">
            <button
              type="button"
              onClick={() => setKind("pro")}
              className={`px-3 py-1.5 ${kind === "pro" ? "bg-primary/15 text-primary" : ""}`}
            >
              {professionalLabel}
            </button>
            <button
              type="button"
              onClick={() => setKind("personal")}
              className={`px-3 py-1.5 ${kind === "personal" ? "bg-primary/15 text-primary" : ""}`}
            >
              {personalLabel}
            </button>
          </div>

          {prefersReducedMotion ? (
            <div className="space-y-6">
              {filtered.map((item) => (
                <ProjectSlide key={item.title} project={item} />
              ))}
            </div>
          ) : (
            project && (
              <div ref={frameRef}>
                <ProjectSlide project={project} />
              </div>
            )
          )}

          {!prefersReducedMotion && (
            <p className="mt-4 font-mono text-[11px] text-text-secondary">
              {String(active + 1).padStart(2, "0")} / {String(filtered.length).padStart(2, "0")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function ProjectSlide({ project }: { project: IProject }) {
  return (
    <article className="term-window min-w-0 overflow-hidden rounded-md">
      {project.image && (
        <div className="relative h-40 overflow-hidden bg-background-lighter md:h-52">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover object-top"
          />
        </div>
      )}
      <div className="min-w-0 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold text-text-primary">{project.title}</h3>
          <div className="flex shrink-0 gap-3 font-mono text-xs text-primary">
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                link
              </a>
            )}
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                git
              </a>
            )}
          </div>
        </div>
        <div className="mt-2 max-h-[22vh] space-y-1.5 overflow-y-auto text-sm leading-relaxed text-text-secondary">
          {project.description.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <ul className="mt-3 flex min-w-0 flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <li
              key={tech}
              className="rounded-sm border border-primary/20 px-2 py-0.5 font-mono text-[10px]"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
