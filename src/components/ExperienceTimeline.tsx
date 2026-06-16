import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ExperienceCard } from "./ExperienceCard";
import type { IExperience } from "../types";

interface IExperienceTimelineProps {
  experiences: IExperience[];
}

const cardVariants = {
  hidden: { opacity: 0, x: -40, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      delay: i * 0.05,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function ExperienceTimeline({ experiences }: IExperienceTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });

  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="relative" ref={containerRef}>
      <div className="absolute left-[23.5px] top-0 h-full w-px bg-primary opacity-10" />

      <motion.div
        className="absolute left-[23.5px] top-0 w-px bg-primary origin-top"
        style={{ scaleY: lineScaleY, height: "100%" }}
      />

      <div className="space-y-12 pl-12 pr-4 pb-12">
        {experiences.map((experience, index) => (
          <motion.div
            key={index}
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
                delay: index * 0.05 + 0.2,
                type: "spring",
                stiffness: 200,
              }}
              className="absolute -left-[28px] top-[14px] flex items-center justify-center"
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-primary"
                whileInView={{
                  boxShadow: [
                    "0 0 0px #64ffda",
                    "0 0 8px #64ffda",
                    "0 0 0px #64ffda",
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: 1,
                  delay: index * 0.05 + 0.4,
                }}
              />
              <div className="absolute w-4 h-4 rounded-full border border-primary opacity-40" />
            </motion.div>
            <ExperienceCard {...experience} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
