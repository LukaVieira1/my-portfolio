import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CORE_STACKS } from "../../lib/coreStack";
import { assert } from "../../lib/assert";
import { GhostLetters } from "../GhostType";

/**
 * Capítulo tipográfico — Principais tecnologias.
 * Presença cinematic, não chips.
 */
export function ChapterStack() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  assert(CORE_STACKS.length === 4, "expected 4 core stacks");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      id="stack"
      ref={ref}
      className="relative overflow-hidden px-5 py-28 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div style={{ y: headerY }} className="max-w-2xl">
          <p className="font-mono text-sm text-primary">
            {t("stack.eyebrow")}
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-text-primary md:text-5xl">
            {t("stack.title")}
          </h2>
          <p className="mt-5 max-w-md text-base text-text-secondary md:text-lg">
            {t("stack.craft")}
          </p>
        </motion.div>

        <ul className="mt-16 space-y-2 md:mt-24 md:space-y-4">
          {CORE_STACKS.map((tech, index) => (
            <StackLine key={tech} tech={tech} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function StackLine({ tech, index }: { tech: string; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [index % 2 === 0 ? -48 : 48, 0],
  );
  const opacity = useTransform(scrollYProgress, [0, 0.55], [0.15, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);

  return (
    <motion.li
      ref={ref}
      style={{ x, opacity, scale }}
      className="border-b border-text-primary/10 py-4 md:py-6"
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-xs text-primary md:text-sm">
          0{index + 1}
        </span>
        <p className="flex-1 text-right font-display text-[clamp(2.5rem,9vw,7.5rem)] font-extrabold leading-[0.9] tracking-tight text-text-primary">
          <GhostLetters text={tech} />
        </p>
      </div>
    </motion.li>
  );
}
