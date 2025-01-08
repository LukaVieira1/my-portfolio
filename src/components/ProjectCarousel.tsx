import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { ProjectCard } from "./ProjectCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Project {
  title: string;
  description: string[];
  technologies: string[];
  link?: string;
  isPersonal: boolean;
  githubLink?: string;
  image?: string;
}

interface ProjectCarouselProps {
  projects: Project[];
  key?: string | number;
}

export function ProjectCarousel({ projects, key }: ProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayDelay = 3000;
  const autoPlayResumeDelay = 5000;

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  const handleManualPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleManualNext = () => {
    setIsAutoPlaying(false);
    handleNext();
  };

  const handleManualInteraction = () => {
    setIsAutoPlaying(false);
  };

  // Autoplay
  useEffect(() => {
    let autoPlayTimer: number;
    let resumeTimer: number;

    if (isAutoPlaying) {
      autoPlayTimer = setInterval(handleNext, autoPlayDelay);
    }

    if (!isAutoPlaying) {
      resumeTimer = setTimeout(() => {
        setIsAutoPlaying(true);
      }, autoPlayResumeDelay);
    }

    return () => {
      clearInterval(autoPlayTimer);
      clearTimeout(resumeTimer);
    };
  }, [isAutoPlaying, handleNext, autoPlayDelay]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [key]);

  return (
    <div
      className="relative w-full min-h-[600px] flex items-start justify-center px-4 md:px-16"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="relative w-full max-w-lg pt-8">
        <div className="absolute left-0 md:-left-16 top-[300px] z-10 transform -translate-x-full md:translate-x-0">
          <button
            onClick={handleManualPrev}
            className="text-primary hover:text-text-primary transition-colors p-2 cursor-pointer"
          >
            <FiChevronLeft size={32} />
          </button>
        </div>

        <div className="absolute right-0 md:-right-20 top-[300px] z-10 transform translate-x-full md:translate-x-0">
          <button
            onClick={handleManualNext}
            className="text-primary hover:text-text-primary transition-colors p-2 cursor-pointer"
          >
            <FiChevronRight size={32} />
          </button>
        </div>

        <AnimatePresence mode="popLayout">
          {projects.map((project, index) => {
            const distance =
              (index - currentIndex + projects.length) % projects.length;
            const isVisible = distance <= 2;

            if (!isVisible) return null;

            return (
              <motion.div
                key={project.title}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: 1 - distance * 0.05,
                  opacity: 1,
                  zIndex: projects.length - distance,
                  x: distance * (window.innerWidth < 768 ? 20 : 30),
                  y: distance * (window.innerWidth < 768 ? 15 : 20),
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-0 left-0 w-full origin-top"
              >
                <div
                  className={`relative ${
                    distance > 0 ? "opacity-30 pointer-events-none" : ""
                  }`}
                >
                  <ProjectCard {...project} />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              handleManualInteraction();
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-primary" : "bg-primary/20"
            } cursor-pointer`}
          />
        ))}
      </div>
    </div>
  );
}
