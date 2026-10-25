import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "../hooks/useGSAP";
import type { IProject } from "../types";

gsap.registerPlugin(ScrollTrigger);

interface ProjectGalleryProps {
  projects: IProject[];
  professionalLabel: string;
  personalLabel: string;
}

export function ProjectGallery({
  projects,
  professionalLabel,
  personalLabel,
}: ProjectGalleryProps) {
  const [kind, setKind] = useState<"pro" | "personal">("pro");
  const [open, setOpen] = useState<IProject | null>(null);
  const pinRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = useGSAP();
  const list = projects.filter((p) =>
    kind === "personal" ? p.isPersonal : !p.isPersonal,
  );

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track || prefersReducedMotion) return;

    const setup = () => {
      const distance = Math.max(0, track.scrollWidth - window.innerWidth);
      return ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        end: () => `+=${distance + window.innerHeight * 0.45}`,
        pin: true,
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const skew = gsap.utils.clamp(-8, 8, self.getVelocity() / 400);
          gsap.set(track, {
            x: -distance * self.progress,
            skewX: skew,
          });
          track.querySelectorAll<HTMLElement>("[data-shot]").forEach((shot) => {
            const rect = shot.getBoundingClientRect();
            const center = (rect.left + rect.right) / 2;
            const dist = Math.min(1, Math.abs(center - window.innerWidth / 2) / (window.innerWidth * 0.7));
            const inset = 4 + dist * 12;
            gsap.set(shot, {
              clipPath: `inset(${inset}% ${inset * 0.6}% ${inset}% ${inset * 0.6}%)`,
              scale: 1.16 - dist * 0.1,
            });
          });
        },
      });
    };

    let st = setup();
    const refresh = () => {
      st.kill();
      gsap.set(track, { x: 0, skewX: 0 });
      st = setup();
    };
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("resize", refresh);
      st.kill();
      gsap.set(track, { x: 0, skewX: 0 });
    };
  }, [kind, list.length, prefersReducedMotion]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || !open) return;
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: "power2.out" });
    const panel = overlay.querySelector("[data-panel]");
    if (panel) {
      gsap.fromTo(
        panel,
        { y: 36, scale: 0.94 },
        { y: 0, scale: 1, duration: 0.42, ease: "expo.out" },
      );
    }
  }, [open]);

  return (
    <section id="projects" ref={pinRef} className="relative min-w-0 overflow-hidden">
      <div className="flex min-h-[100dvh] flex-col justify-center">
        <div className="flex gap-3 px-5 pt-20 md:px-12">
          <button
            type="button"
            onClick={() => setKind("pro")}
            className={`font-mono text-xs ${kind === "pro" ? "text-primary" : "text-text-secondary"}`}
          >
            {professionalLabel}
          </button>
          <button
            type="button"
            onClick={() => setKind("personal")}
            className={`font-mono text-xs ${kind === "personal" ? "text-primary" : "text-text-secondary"}`}
          >
            {personalLabel}
          </button>
        </div>
        <div
          ref={trackRef}
          className={`flex gap-[4vw] px-5 py-8 md:px-12 ${prefersReducedMotion ? "flex-col" : "w-max flex-nowrap"}`}
        >
          {list.map((project) => (
            <button
              key={project.title}
              type="button"
              onClick={() => setOpen(project)}
              className="w-[82vw] shrink-0 text-left md:w-[58vw]"
            >
              <div className="relative h-[46vw] max-h-72 min-h-40 overflow-hidden bg-background-light md:h-[32vw]">
                {project.image && (
                  <img
                    data-shot
                    src={project.image}
                    alt={project.title}
                    className="h-[130%] w-full origin-center object-cover object-top"
                  />
                )}
              </div>
              <h3 className="mt-4 break-words text-[11vw] font-extrabold leading-[0.9] text-text-primary md:text-6xl">
                {project.title}
              </h3>
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[70] overflow-y-auto bg-[#04070c]/95 px-5 py-16 md:px-16"
        >
          <div data-panel>
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="mb-6 font-mono text-xs text-primary"
            >
              close
            </button>
            <h3 className="text-4xl font-extrabold text-text-primary">{open.title}</h3>
            <div className="mt-4 max-w-2xl space-y-3 text-sm leading-relaxed">
              {open.description.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <ul className="mt-5 flex min-w-0 flex-wrap gap-2">
              {open.technologies.map((tech) => (
                <li key={tech} className="rounded-full border border-primary/20 px-2 py-1 font-mono text-[11px]">
                  {tech}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-4 font-mono text-sm text-primary">
              {open.link && (
                <a href={open.link} target="_blank" rel="noopener noreferrer">
                  link
                </a>
              )}
              {open.githubLink && (
                <a href={open.githubLink} target="_blank" rel="noopener noreferrer">
                  git
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
