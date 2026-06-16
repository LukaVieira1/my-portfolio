import { motion } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import type { IProject } from "../types";

export function ProjectCard({
  title,
  description,
  technologies,
  link,
  isPersonal,
  githubLink,
  image,
}: IProject) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col max-w-lg mx-auto bg-background-light rounded-xl overflow-hidden shadow-xl min-h-[600px] border border-transparent hover:border-primary/20 hover:shadow-[0_0_30px_rgba(100,255,218,0.07)] transition-all duration-300 group"
    >
      <div className="relative h-[225px] overflow-hidden">
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full"
          >
            <img
              src={image || "/project-placeholder.jpg"}
              alt={title}
              className="w-full h-full object-cover brightness-75 group-hover:brightness-90 group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-background/40 group-hover:bg-background/10 transition-all duration-500" />
          </a>
        ) : (
          <>
            <img
              src={image || "/project-placeholder.jpg"}
              alt={title}
              className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-all duration-500" />
          </>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="grow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-primary text-xl font-bold group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            <div className="flex gap-4 relative z-10">
              {githubLink && isPersonal && (
                <motion.a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-text-primary hover:text-primary transition-colors"
                >
                  <FiGithub size={20} />
                </motion.a>
              )}
              {link && (
                <motion.a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-text-primary hover:text-primary transition-colors"
                >
                  <FiExternalLink size={20} />
                </motion.a>
              )}
            </div>
          </div>

          <div className="text-text-secondary space-y-2 text-sm mb-6 leading-relaxed">
            {description.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 font-mono text-xs pt-4 border-t border-background-lighter/50">
          {technologies.map((tech) => (
            <motion.span
              key={tech}
              whileHover={{ scale: 1.08 }}
              className="text-primary px-2 py-0.5 rounded bg-primary/5 hover:bg-primary/10 transition-colors cursor-default"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
