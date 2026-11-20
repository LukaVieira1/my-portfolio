import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { assert } from "../../lib/assert";
import { GhostType } from "../GhostType";

/** About editorial — tipografia + foto; stacks ficam no capítulo próprio. */
export function ChapterAbout() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);

  const paragraphs = [t("about.paragraphs.0"), t("about.paragraphs.1")];
  assert(paragraphs.every((p) => p.length > 0), "about paragraphs missing");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const textY = useTransform(scrollYProgress, [0, 1], [28, -28]);
  const ghostX = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  return (
    <section
      id="about"
      ref={ref}
      className="relative mx-auto max-w-6xl px-5 py-28 md:px-10 md:py-40"
    >
      <motion.span
        style={{ x: ghostX }}
        className="pointer-events-none absolute -right-2 top-16 font-display text-[6rem] font-extrabold leading-none text-text-primary/8 md:top-24 md:text-[10rem]"
        aria-hidden
      >
        About
      </motion.span>

      <div className="grid items-center gap-12 md:grid-cols-12 md:gap-14">
        <motion.div style={{ y: textY }} className="md:col-span-6">
          <p className="font-mono text-sm text-primary">01.</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-text-primary md:text-6xl">
            <GhostType text={t("about.title")} />
          </h2>
          <div className="mt-8 space-y-5 text-sm leading-relaxed text-text-secondary md:text-lg">
            {paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: index * 0.1, duration: 0.55 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </motion.div>

        <motion.div
          style={{ y: photoY }}
          className="relative md:col-span-6"
        >
          <div className="mx-auto max-w-md overflow-hidden">
            <img
              src="/profile-pic.jpeg"
              alt="Luka Vieira"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
