import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ExperienceCard } from "./ExperienceCard";
import type { IExperience } from "../types";
import { assert } from "../lib/assert";

interface IExperienceTimelineProps {
  experiences: IExperience[];
}

const cardVariants = {
  hidden: { opacity: 0, x: -36, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.55,
      delay: i * 0.05,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function ExperienceTimeline({ experiences }: IExperienceTimelineProps) {
  assert(experiences.length > 0, "experiences list cannot be empty");

  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });

  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="relative" ref={containerRef}>
      <div className="absolute left-[23.5px] top-0 h-full w-px bg-primary/15" />

      <motion.div
        className="absolute left-[23.5px] top-0 h-full w-px origin-top bg-primary"
        style={{ scaleY: lineScaleY }}
      />

      <div className="space-y-12 pb-12 pl-12 pr-4">
        {experiences.map((experience, index) => (
          <motion.div
            key={`${experience.company}-${experience.period}`}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="relative"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.05 + 0.15,
                type: "spring",
                stiffness: 220,
              }}
              className="absolute -left-[28px] top-[14px] flex items-center justify-center"
            >
              <div className="h-2 w-2 rounded-full bg-primary" />
              <div className="absolute h-4 w-4 rounded-full border border-primary/40" />
            </motion.div>
            <ExperienceCard {...experience} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
