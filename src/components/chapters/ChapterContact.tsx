import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

export function ChapterContact() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const rise = useTransform(scrollYProgress, [0, 0.6], [80, 0]);
  const fade = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative flex min-h-[90svh] items-center justify-center px-5 py-24 md:px-10 md:py-32"
    >
      <motion.div style={{ y: rise, opacity: fade }} className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-sm text-primary">04.</p>
        <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-text-primary md:text-7xl">
          {t("contact.title")}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base text-text-secondary md:text-lg">
          {t("contact.description")}
        </p>

        <a
          href="mailto:lukavieira14@gmail.com"
          className="mt-10 inline-flex max-w-full items-center gap-3 break-all border border-primary px-5 py-4 font-mono text-sm text-primary transition-colors hover:bg-primary/10 md:mt-12 md:px-8 md:text-base"
        >
          <FiMail size={18} />
          lukavieira14@gmail.com
        </a>

        <div className="mt-10 flex justify-center gap-8">
          <a
            href="https://www.linkedin.com/in/lukaviera/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary transition-colors hover:text-primary"
          >
            <FiLinkedin size={24} />
          </a>
          <a
            href="https://github.com/LukaVieira1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary transition-colors hover:text-primary"
          >
            <FiGithub size={24} />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
