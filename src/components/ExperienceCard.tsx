import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { IExperience } from "../types";
import { assert } from "../lib/assert";

export function ExperienceCard({
  company,
  role,
  period,
  description,
  technologies,
  link,
}: IExperience) {
  const { t } = useTranslation();

  assert(company.length > 0, "experience company is required");
  assert(role.length > 0, "experience role is required");
  assert(description.length > 0, `experience "${company}" needs description`);

  return (
    <div className="group mb-8">
      <div className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="max-w-[420px] font-display text-xl font-bold text-text-primary">
            {role}{" "}
            <motion.span
              className="inline-block text-primary"
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              @ {company}
            </motion.span>
          </h3>
          <p className="mt-1 font-mono text-sm opacity-70">{period}</p>
        </div>
        {link && (
          <motion.a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.95 }}
            className="mt-2 flex items-center gap-1 font-mono text-sm text-primary transition-opacity hover:opacity-80 md:mt-0"
          >
            {t("experience.seeMore")} →
          </motion.a>
        )}
      </div>
      <div className="mb-4 max-w-2xl space-y-3 border-l-2 border-primary/15 pl-4 text-text-secondary transition-colors duration-300 group-hover:border-primary/40">
        {description.map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 font-mono text-xs text-text-secondary">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="bg-background-light/70 px-2 py-0.5 before:mr-1 before:text-primary before:content-['▹']"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
