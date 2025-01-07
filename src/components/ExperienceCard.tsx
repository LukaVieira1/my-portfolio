import { motion } from "framer-motion";

interface ExperienceCardProps {
  company: string;
  role: string;
  period: string;
  description: string;
  technologies: string[];
}

export function ExperienceCard({
  company,
  role,
  period,
  description,
  technologies,
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
          <h3 className="text-xl font-bold text-[#ccd6f6]">
            {role} <span className="text-[#64ffda]">@ {company}</span>
          </h3>
          <p className="font-mono text-sm">{period}</p>
        </div>
      </div>
      <p className="text-[#8892b0] mb-4 max-w-2xl">{description}</p>
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
