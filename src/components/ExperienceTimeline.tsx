import { motion } from "framer-motion";
import { ExperienceCard } from "./ExperienceCard";
import { FiChevronDown } from "react-icons/fi";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <div className="relative">
      <div className="absolute left-[23.5px] top-0 h-full w-px bg-[#64ffda] opacity-20" />

      <div className="space-y-12 pl-12 max-h-[600px] overflow-y-auto custom-scrollbar pr-4">
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

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center text-[#8892b0] text-sm"
      >
        <span className="mb-2">{t("experience.seeMore")}</span>
        <motion.div
          animate={{
            y: [0, 5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FiChevronDown size={20} className="text-[#64ffda]" />
        </motion.div>
      </motion.div>
    </div>
  );
}
