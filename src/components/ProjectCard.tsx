import { motion } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";

interface ProjectCardProps {
  title: string;
  description: string[];
  technologies: string[];
  link?: string;
  isPersonal: boolean;
  githubLink?: string;
  image?: string;
}

export function ProjectCard({
  title,
  description,
  technologies,
  link,
  isPersonal,
  githubLink,
  image,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col max-w-lg mx-auto bg-[#112240] rounded-lg overflow-hidden shadow-xl min-h-[600px]"
    >
      <div className="relative h-[225px]">
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
              className="w-full h-full object-cover brightness-75 hover:brightness-100 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-[#0a192f]/30 hover:bg-transparent transition-all duration-500" />
          </a>
        ) : (
          <>
            <img
              src={image || "/project-placeholder.jpg"}
              alt={title}
              className="w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 bg-[#0a192f]/30" />
          </>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#ccd6f6] text-xl font-bold">{title}</h3>
            <div className="flex gap-4 relative z-10">
              {githubLink && isPersonal && (
                <motion.a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-[#ccd6f6] hover:text-[#64ffda] transition-colors"
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
                  whileTap={{ scale: 0.9 }}
                  className="text-[#ccd6f6] hover:text-[#64ffda] transition-colors"
                >
                  <FiExternalLink size={20} />
                </motion.a>
              )}
            </div>
          </div>

          <div className="text-[#8892b0] space-y-2 text-sm mb-6">
            {description.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 font-mono text-xs pt-4 border-t border-[#233554]">
          {technologies.map((tech) => (
            <motion.span
              key={tech}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-[#64ffda]"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
