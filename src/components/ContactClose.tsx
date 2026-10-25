import { useRef, useState, type PointerEvent } from "react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { Shell } from "./Shell";

interface ContactCloseProps {
  title: string;
  description: string;
}

const EMAIL = "lukavieira14@gmail.com";

export function ContactClose({ title, description }: ContactCloseProps) {
  const btn = useRef<HTMLAnchorElement>(null);
  const [copied, setCopied] = useState(false);

  const magnet = (e: PointerEvent<HTMLAnchorElement>) => {
    const el = btn.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate3d(${x * 0.18}px,${y * 0.18}px,0)`;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
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
            href={`mailto:${EMAIL}`}
            onPointerMove={magnet}
            onPointerLeave={() => {
              if (btn.current) btn.current.style.transform = "none";
            }}
            className="inline-flex w-fit border border-current px-6 py-4 font-mono text-sm text-primary md:text-lg"
          >
            {EMAIL}
          </a>
          <button
            type="button"
            onClick={copy}
            className="mt-4 block font-mono text-xs uppercase tracking-[0.16em] text-text-secondary"
          >
            {copied ? "copied" : "copy email"}
          </button>
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
