import { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "../hooks/useGSAP";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
}

gsap.registerPlugin(ScrollTrigger);

export function ParallaxImage({
  src,
  alt,
  className = "",
  speed = 0.5,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { prefersReducedMotion } = useGSAP();

  useEffect(() => {
    if (!containerRef.current || !imageRef.current || prefersReducedMotion) return;

    const image = imageRef.current;

    gsap.to(image, {
      y: -30 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === containerRef.current) {
          trigger.kill();
        }
      });
    };
  }, [speed, prefersReducedMotion]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <img 
        ref={imageRef} 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover will-change-transform"
      />
    </div>
  );
}
