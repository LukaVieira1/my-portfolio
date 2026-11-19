import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { mainTechs } from "../../data";
import { assert } from "../../lib/assert";

export function ChapterAbout() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);

  const paragraphs = [t("about.paragraphs.0"), t("about.paragraphs.1")];
  assert(paragraphs.every((p) => p.length > 0), "about paragraphs missing");
  assert(mainTechs.length > 0, "mainTechs empty");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const labelY = useTransform(scrollYProgress, [0, 1], [20, -120]);

  return (
    <section
      id="about"
      ref={ref}
      className="relative mx-auto min-h-screen max-w-6xl px-6 py-28 md:px-10 md:py-36"
    >
      <div className="grid items-center gap-12 md:grid-cols-12 md:gap-8">
        <motion.div style={{ y: textY }} className="md:col-span-6">
          <p className="font-mono text-sm text-primary">01.</p>
          <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-text-primary md:text-5xl">
            {t("about.title")}
          </h2>

          <div className="mt-8 space-y-5 text-base leading-relaxed text-text-secondary md:text-lg">
            {paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: index * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <p className="mt-10 font-medium text-text-primary">{t("about.mainTechs")}</p>
          <ul className="mt-4 columns-2 gap-x-8 font-mono text-sm">
            {mainTechs.map((tech, i) => (
              <motion.li
                key={tech}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="mb-2 break-inside-avoid before:mr-2 before:text-primary before:content-['▹']"
              >
                {tech}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <div className="relative md:col-span-6">
          <motion.p
            style={{ y: labelY }}
            className="pointer-events-none absolute -left-2 top-0 z-10 font-display text-7xl font-extrabold leading-none text-primary/15 md:-left-8 md:text-8xl"
            aria-hidden
          >
            LV
          </motion.p>
          <motion.div style={{ y: photoY }} className="relative mx-auto max-w-md">
            <img
              src="/profile-pic.jpeg"
              alt="Luka Vieira"
              className="aspect-[4/5] w-full object-cover grayscale transition-[filter] duration-500 hover:grayscale-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
