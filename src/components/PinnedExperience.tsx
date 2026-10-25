import { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ExperienceCard } from "./ExperienceCard";
import { useGSAP } from "../hooks/useGSAP";
import type { IExperience } from "../types";

interface PinnedExperienceProps {
  experiences: IExperience[];
}

gsap.registerPlugin(ScrollTrigger);

export function PinnedExperience({ experiences }: PinnedExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const { prefersReducedMotion } = useGSAP();

  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) return;

    const container = containerRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (cards.length === 0) return;

    cards.forEach((card, index) => {
      if (index === cards.length - 1) {
        return;
      }

      ScrollTrigger.create({
        trigger: card,
        start: "top 120px",
        end: "bottom 120px",
        pin: true,
        pinSpacing: false,
        scrub: true,
        onEnter: () => {
          gsap.to(card, {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.3,
          });
        },
        onLeave: () => {
          gsap.to(card, {
            scale: 0.95,
            opacity: 0.5,
            filter: "blur(4px)",
            duration: 0.3,
          });
        },
        onEnterBack: () => {
          gsap.to(card, {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.3,
          });
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger && cards.includes(trigger.vars.trigger as HTMLDivElement)) {
          trigger.kill();
        }
      });
    };
  }, [experiences, prefersReducedMotion]);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    return () => {
      cardsRef.current = [];
    };
  }, []);

  return (
    <div ref={containerRef} className="relative space-y-8">
      {experiences.map((experience, index) => (
        <div
          key={index}
          ref={addToRefs}
          className="relative bg-background-light/50 backdrop-blur-sm rounded-lg transition-all duration-300"
        >
          <ExperienceCard {...experience} />
        </div>
      ))}
    </div>
  );
}
