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
  const imageRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = useGSAP();

  useEffect(() => {
    if (!imageRef.current || prefersReducedMotion) return;

    const element = imageRef.current;

    gsap.to(element, {
      yPercent: 20 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [speed, prefersReducedMotion]);

  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={imageRef} className="w-full h-full">
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
