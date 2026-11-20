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
    offset: ["start start", "end end"],
  });

  const photoScale = useTransform(scrollYProgress, [0, 0.45, 1], [1.18, 1, 0.96]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["8%", "-6%"]);
  const photoClip = useTransform(
    scrollYProgress,
    [0, 0.35],
    ["inset(12% 18% 12% 18%)", "inset(0% 0% 0% 0%)"],
  );
  const titleY = useTransform(scrollYProgress, [0, 1], [40, -60]);
  const copyOpacity = useTransform(scrollYProgress, [0.12, 0.32, 0.85], [0, 1, 1]);
  const copyY = useTransform(scrollYProgress, [0.12, 0.4], [48, 0]);
  const watermarkX = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const watermarkOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.12, 0.18, 0.06]);
  const techsOpacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1]);
  const techsY = useTransform(scrollYProgress, [0.35, 0.6], [28, 0]);
  const scrubLine = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="about"
      ref={ref}
      className="relative"
      style={{ height: "220vh" }}
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-5 md:grid-cols-12 md:gap-10 md:px-10">
          <motion.span
            style={{ x: watermarkX, opacity: watermarkOpacity }}
            className="pointer-events-none absolute -top-4 right-4 font-display text-[5.5rem] font-extrabold leading-none text-text-primary md:-top-8 md:right-10 md:text-[9rem]"
            aria-hidden
          >
            LV
          </motion.span>

          <div className="relative z-10 md:col-span-6">
            <motion.div style={{ y: titleY }}>
              <p className="font-mono text-sm text-primary">01.</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-text-primary md:text-5xl">
                {t("about.title")}
              </h2>
              <motion.div
                className="mt-4 h-px origin-left bg-primary"
                style={{ scaleX: scrubLine }}
              />
            </motion.div>

            <motion.div
              style={{ opacity: copyOpacity, y: copyY }}
              className="mt-6 space-y-4 text-sm leading-relaxed text-text-secondary md:mt-8 md:space-y-5 md:text-lg"
            >
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </motion.div>

            <motion.div style={{ opacity: techsOpacity, y: techsY }} className="mt-8">
              <p className="font-medium text-text-primary">{t("about.mainTechs")}</p>
              <ul className="mt-3 columns-2 gap-x-6 font-mono text-xs md:text-sm">
                {mainTechs.map((tech) => (
                  <li
                    key={tech}
                    className="mb-1.5 break-inside-avoid before:mr-2 before:text-primary before:content-['▹']"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="relative md:col-span-6">
            <motion.div
              style={{
                scale: photoScale,
                y: photoY,
                clipPath: photoClip,
              }}
              className="relative mx-auto max-w-sm overflow-hidden md:max-w-md"
            >
              <img
                src="/profile-pic.jpeg"
                alt="Luka Vieira"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
