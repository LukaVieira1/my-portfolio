import { motion } from "framer-motion";

interface SkillCardProps {
  title: string;
  skills: string[];
}

export function SkillCard({ title, skills }: SkillCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-background-light rounded-lg shadow-md p-6"
    >
      <h3 className="text-xl font-bold text-text-primary mb-4">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <motion.span
            key={skill}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            className="px-3 py-1 bg-background text-primary rounded-full text-sm"
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
