import { useTranslation } from "react-i18next";
import { mainTechs } from "../data";

interface AboutPanelProps {
  title: string;
  paragraphs: string[];
  techsLabel: string;
}

export function AboutPanel({ title, paragraphs, techsLabel }: AboutPanelProps) {
  const { t } = useTranslation();

  return (
    <section id="about" className="min-w-0 px-5 py-20 md:px-10">
      <p className="font-mono text-xs text-primary">01.</p>
      <h2 className="mb-8 text-3xl font-extrabold text-text-primary md:text-4xl">
        {title}
      </h2>

      <div className="grid min-w-0 gap-8 md:grid-cols-[1.3fr_0.7fr]">
        <div className="term-window min-w-0 rounded-md p-4 md:p-6">
          <div className="mb-4 flex items-center gap-2 font-mono text-[11px] text-text-secondary">
            <span className="h-2 w-2 rounded-full bg-primary/80" />
            about.md
          </div>
          <div className="mb-6 flex gap-8">
            <div>
              <div className="text-3xl font-extrabold text-primary">8+</div>
              <div className="font-mono text-[11px]">{t("about.yearsIt")}</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-primary">5+</div>
              <div className="font-mono text-[11px]">{t("about.yearsDev")}</div>
            </div>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-text-secondary md:text-base">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <p className="mt-6 font-mono text-xs text-primary">{techsLabel}</p>
          <ul className="mt-3 flex min-w-0 flex-wrap gap-2">
            {mainTechs.map((tech) => (
              <li
                key={tech}
                className="rounded-sm border border-primary/20 bg-primary/5 px-2 py-1 font-mono text-[11px] text-text-primary"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto h-[240px] w-full max-w-[240px]">
          <div className="relative z-10 h-full w-full overflow-hidden rounded-md border border-primary/30">
            <img
              src="/profile-pic.jpeg"
              alt="Luka Vieira"
              className="h-full w-full object-cover grayscale"
            />
          </div>
          <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-md border border-primary/40" />
        </div>
      </div>
    </section>
  );
}
