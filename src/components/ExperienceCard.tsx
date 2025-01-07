import { motion } from "framer-motion";

interface ExperienceCardProps {
  company: string;
  role: string;
  period: string;
  description: string[];
  technologies: string[];
  link?: string;
}

export function ExperienceCard({
  company,
  role,
  period,
  description,
  technologies,
  link,
}: ExperienceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="mb-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
        <div>
          <h3 className="text-xl font-bold text-[#ccd6f6] max-w-xl">
            {role} <span className="text-[#64ffda]">@ {company}</span>
          </h3>
          <p className="font-mono text-sm">{period}</p>
        </div>
        {link && (
          <motion.a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-[#64ffda]">Saiba mais</span>
          </motion.a>
        )}
      </div>
      <div className="text-[#8892b0] mb-4 max-w-2xl space-y-4">
        {description.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 font-mono text-sm text-[#8892b0]">
        {technologies.map((tech) => (
          <motion.span
            key={tech}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="before:content-['▹'] before:text-[#64ffda] before:mr-2 cursor-pointer hover:text-[#64ffda] transition-colors"
          >
            {tech}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
