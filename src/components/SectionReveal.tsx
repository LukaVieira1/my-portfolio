import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "../hooks/useGSAP";

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

gsap.registerPlugin(ScrollTrigger);

export function SectionReveal({
  children,
  className = "",
  delay = 0,
}: SectionRevealProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = useGSAP();

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return;

    const element = sectionRef.current;

    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 60,
        filter: "blur(10px)",
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power3.out",
        delay,
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          once: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [delay, prefersReducedMotion]);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
}
