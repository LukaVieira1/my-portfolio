import { useRef, type PointerEvent } from "react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { Shell } from "./Shell";

interface ContactCloseProps {
  title: string;
  description: string;
}

export function ContactClose({ title, description }: ContactCloseProps) {
  const btn = useRef<HTMLAnchorElement>(null);

  const magnet = (e: PointerEvent<HTMLAnchorElement>) => {
    const el = btn.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate3d(${x * 0.25}px,${y * 0.25}px,0)`;
  };

  return (
    <section id="contact" className="flex min-h-[100dvh] min-w-0 flex-col justify-center py-24">
      <Shell className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.6fr)]">
        <div className="min-w-0">
          <h2 className="max-w-4xl text-[14vw] font-extrabold leading-[0.86] tracking-[-0.05em] text-text-primary md:text-7xl xl:text-8xl">
            {title}
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-relaxed md:text-lg">{description}</p>
        </div>
        <div className="min-w-0">
          <a
            ref={btn}
            href="mailto:lukavieira14@gmail.com"
            onPointerMove={magnet}
            onPointerLeave={() => {
              if (btn.current) btn.current.style.transform = "none";
            }}
            className="inline-flex w-fit border border-primary px-6 py-4 font-mono text-sm text-primary md:text-lg"
          >
            lukavieira14@gmail.com
          </a>
          <div className="mt-8 flex gap-5 text-text-secondary">
            <a
              href="https://www.linkedin.com/in/lukaviera/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FiLinkedin size={24} />
            </a>
            <a
              href="https://github.com/LukaVieira1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FiGithub size={24} />
            </a>
          </div>
        </div>
      </Shell>
    </section>
  );
}
