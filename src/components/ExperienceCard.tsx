import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { IExperience } from "../types";

export function ExperienceCard({
  company,
  role,
  period,
  description,
  technologies,
  link,
}: IExperience) {
  const { t } = useTranslation();
  return (
    <div className="mb-8 group">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
        <div>
          <h3 className="text-xl font-bold text-text-primary max-w-[400px]">
            {role}{" "}
            <motion.span
              className="text-primary inline-block"
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              @ {company}
            </motion.span>
          </h3>
          <p className="font-mono text-sm mt-1 opacity-70">{period}</p>
        </div>
        {link && (
          <motion.a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.95 }}
            className="text-primary hover:opacity-80 transition-opacity font-mono text-sm flex items-center gap-1 mt-2 md:mt-0"
          >
            {t("experience.seeMore")} →
          </motion.a>
        )}
      </div>
      <div className="text-text-secondary mb-4 max-w-2xl space-y-3 border-l-2 border-primary/10 pl-4 group-hover:border-primary/30 transition-colors duration-300">
        {description.map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 font-mono text-xs text-text-secondary">
        {technologies.map((tech) => (
          <motion.span
            key={tech}
            whileHover={{ scale: 1.08, color: "var(--color-primary)" }}
            whileTap={{ scale: 0.95 }}
            className="before:content-['▹'] before:text-primary before:mr-1 cursor-default hover:text-primary transition-colors px-2 py-0.5 rounded bg-background-light/50"
          >
            {tech}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
