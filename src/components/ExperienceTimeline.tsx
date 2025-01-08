import { motion } from "framer-motion";
import { ExperienceCard } from "./ExperienceCard";

interface Experience {
  company: string;
  role: string;
  period: string;
  description: string[];
  technologies: string[];
  link?: string;
}

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-[23.5px] top-0 h-full w-px bg-[#64ffda] opacity-20" />

      <div className="space-y-12 pl-12 max-h-[600px] overflow-y-auto custom-scrollbar">
        {experiences.map((experience, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="absolute -left-[28px] top-[14px] flex items-center justify-center"
            >
              <div className="w-2 h-2 rounded-full bg-[#64ffda]" />
              <div className="absolute w-4 h-4 rounded-full border border-[#64ffda] opacity-50" />
            </motion.div>
            <ExperienceCard {...experience} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
