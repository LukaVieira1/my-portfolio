import { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "../hooks/useGSAP";

gsap.registerPlugin(ScrollTrigger);

interface ClipPathRevealProps {
  src: string;
  alt: string;
  className?: string;
}

export function ClipPathReveal({ src, alt, className = "" }: ClipPathRevealProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = useGSAP();

  useEffect(() => {
    if (!imageRef.current || prefersReducedMotion) return;

    const element = imageRef.current;

    const tween = gsap.fromTo(
      element,
      {
        clipPath: "inset(100% 0% 0% 0%)",
      },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          once: true,
        },
      }
    );

    if (element.getBoundingClientRect().top < window.innerHeight) {
      tween.scrollTrigger?.kill();
      gsap.set(element, { clipPath: "inset(0% 0% 0% 0%)" });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [prefersReducedMotion]);

  return (
    <div className={`relative group ${className}`}>
      <div
        ref={imageRef}
        className="relative z-10 rounded-lg overflow-hidden w-full h-full"
        style={{ clipPath: prefersReducedMotion ? "none" : "inset(100% 0 0 0)" }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
        />
      </div>
      <div
        className="absolute inset-0 border-2 border-primary rounded-lg translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300"
        style={{
          boxShadow: "0 0 30px rgba(100,255,218,0.2)",
        }}
      />
    </div>
  );
}
