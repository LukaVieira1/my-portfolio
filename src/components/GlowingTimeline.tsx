import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ExperienceCard } from "./ExperienceCard";
import { useGSAP } from "../hooks/useGSAP";
import type { IExperience } from "../types";

gsap.registerPlugin(ScrollTrigger);

interface GlowingTimelineProps {
  experiences: IExperience[];
}

export function GlowingTimeline({ experiences }: GlowingTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement[]>([]);
  const { prefersReducedMotion } = useGSAP();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });

  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) return;

    const dots = dotsRef.current.filter(Boolean);

    dots.forEach((dot, index) => {
      ScrollTrigger.create({
        trigger: dot,
        start: "center 60%",
        end: "center 40%",
        onEnter: () => {
          gsap.to(dot, {
            scale: 1.8,
            opacity: 1,
            duration: 0.4,
            ease: "back.out(2)",
          });
          gsap.to(dot.querySelector(".glow"), {
            scale: 2,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
          });
        },
        onEnterBack: () => {
          gsap.to(dot, {
            scale: 1.8,
            opacity: 1,
            duration: 0.4,
            ease: "back.out(2)",
          });
        },
        onLeave: () => {
          gsap.to(dot, {
            scale: 1,
            opacity: 0.6,
            duration: 0.3,
          });
        },
        onLeaveBack: () => {
          gsap.to(dot, {
            scale: 1,
            opacity: 0.4,
            duration: 0.3,
          });
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (dotsRef.current.includes(trigger.vars.trigger as HTMLDivElement)) {
          trigger.kill();
        }
      });
    };
  }, [experiences, prefersReducedMotion]);

  const addToDots = (el: HTMLDivElement | null) => {
    if (el && !dotsRef.current.includes(el)) {
      dotsRef.current.push(el);
    }
  };

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

  return (
    <div className="relative" ref={containerRef}>
      {/* Background line */}
      <div className="absolute left-[23.5px] top-0 h-full w-px bg-primary opacity-10" />

      {/* Animated glowing line */}
      <motion.div className="absolute left-[23.5px] top-0 w-px origin-top">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-primary via-primary to-transparent"
          style={{ scaleY: lineScaleY }}
        />
        {/* Glowing tip that follows scroll */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary"
          style={{
            top: useTransform(
              scrollYProgress,
              [0, 1],
              ["0%", "100%"]
            ),
            boxShadow: "0 0 20px rgba(100,255,218,1), 0 0 40px rgba(100,255,218,0.5)",
            filter: "blur(1px)",
          }}
        />
      </motion.div>

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
            {/* Pulsing dot */}
            <div
              ref={addToDots}
              className="absolute -left-[28px] top-[14px] flex items-center justify-center"
            >
              <div
                className="w-3 h-3 rounded-full bg-primary relative z-10"
                style={{
                  boxShadow: "0 0 10px rgba(100,255,218,0.8)",
                }}
              />
              {/* Glow ring */}
              <div
                className="glow absolute w-6 h-6 rounded-full border-2 border-primary opacity-0"
                style={{
                  boxShadow: "0 0 20px rgba(100,255,218,0.8)",
                }}
              />
            </div>

            <ExperienceCard {...experience} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
