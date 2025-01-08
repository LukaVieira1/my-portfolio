import { motion } from "framer-motion";
import { ExperienceCard } from "./ExperienceCard";
import { FiChevronDown } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasScroll, setHasScroll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (containerRef.current) {
        const { scrollHeight, clientHeight } = containerRef.current;
        setHasScroll(scrollHeight > clientHeight);
      }
    };

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScroll();
    checkMobile();

    window.addEventListener("resize", () => {
      checkScroll();
      checkMobile();
    });

    return () => {
      window.removeEventListener("resize", () => {
        checkScroll();
        checkMobile();
      });
    };
  }, []);

  const handleScroll = () => {
    if (containerRef.current) {
      const currentScroll = containerRef.current.scrollTop;
      const scrollAmount = 200;

      containerRef.current.scrollTo({
        top: currentScroll + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const checkIfAtBottom = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
      setIsAtBottom(isBottom);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkIfAtBottom);
      return () => container.removeEventListener("scroll", checkIfAtBottom);
    }
  }, []);

  return (
    <div className="relative">
      <div className="absolute left-[23.5px] top-0 h-full w-px bg-primary opacity-20" />

      <div
        ref={containerRef}
        className="space-y-12 pl-12 max-h-[600px] overflow-y-auto custom-scrollbar pr-4 pb-12"
      >
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
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="absolute w-4 h-4 rounded-full border border-primary opacity-50" />
            </motion.div>
            <ExperienceCard {...experience} />
          </motion.div>
        ))}
      </div>

      {hasScroll && !isMobile && !isAtBottom && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center bg-background-light px-4 py-2 rounded-full shadow-lg"
        >
          <motion.button
            animate={{ y: [0, 5, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-primary"
            onClick={handleScroll}
          >
            <FiChevronDown size={16} />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
