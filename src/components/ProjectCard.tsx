import { motion } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import type { IProject } from "../types";
import { assert } from "../lib/assert";

export function ProjectCard({
  title,
  description,
  technologies,
  link,
  isPersonal,
  githubLink,
  image,
}: IProject) {
  assert(title.length > 0, "project title is required");
  assert(description.length > 0, `project "${title}" needs description`);
  assert(technologies.length > 0, `project "${title}" needs technologies`);
  assert(
    typeof image === "string" && image.length > 0,
    `project "${title}" needs an image path`,
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="content-panel group flex min-h-[560px] max-w-lg mx-auto flex-col overflow-hidden"
    >
      <div className="relative h-[220px] overflow-hidden">
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full w-full"
          >
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </a>
        ) : (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="grow">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-display text-xl font-bold text-text-primary transition-colors duration-300 group-hover:text-primary">
              {title}
            </h3>
            <div className="relative z-10 flex gap-3">
              {githubLink && isPersonal && (
                <motion.a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  className="text-text-primary transition-colors hover:text-primary"
                >
                  <FiGithub size={20} />
                </motion.a>
              )}
              {link && (
                <motion.a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  className="text-text-primary transition-colors hover:text-primary"
                >
                  <FiExternalLink size={20} />
                </motion.a>
              )}
            </div>
          </div>

          <div className="mb-6 space-y-2 text-sm leading-relaxed text-text-secondary">
            {description.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-background-lighter/70 pt-4 font-mono text-xs">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="bg-primary/8 px-2 py-0.5 text-primary"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
