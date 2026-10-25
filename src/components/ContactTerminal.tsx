import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

interface ContactTerminalProps {
  title: string;
  description: string;
}

export function ContactTerminal({ title, description }: ContactTerminalProps) {
  return (
    <section id="contact" className="min-w-0 px-5 py-24 md:px-10">
      <p className="font-mono text-xs text-primary">04.</p>
      <h2 className="mb-4 text-3xl font-extrabold text-text-primary md:text-4xl">
        {title}
      </h2>
      <p className="mb-8 max-w-xl text-sm leading-relaxed text-text-secondary md:text-base">
        {description}
      </p>
      <a
        href="mailto:lukavieira14@gmail.com"
        className="inline-flex items-center gap-2 rounded-sm border border-primary px-5 py-3 font-mono text-sm text-primary"
      >
        <FiMail /> lukavieira14@gmail.com
      </a>
      <div className="mt-6 flex gap-5 text-text-secondary">
        <a
          href="https://www.linkedin.com/in/lukaviera/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary"
          aria-label="LinkedIn"
        >
          <FiLinkedin size={22} />
        </a>
        <a
          href="https://github.com/LukaVieira1"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary"
          aria-label="GitHub"
        >
          <FiGithub size={22} />
        </a>
      </div>
      <p className="mt-16 font-mono text-[11px] text-text-secondary">
        luka-vieira.dev
      </p>
    </section>
  );
}
