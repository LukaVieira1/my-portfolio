import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "../hooks/useGSAP";

interface HeroTitleProps {
  text: string;
  className?: string;
}

export function HeroTitle({ text, className = "" }: HeroTitleProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { prefersReducedMotion } = useGSAP();

  useEffect(() => {
    if (!titleRef.current) return;

    const chars = titleRef.current.querySelectorAll(".char");

    if (prefersReducedMotion) {
      gsap.set(chars, { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      chars,
      {
        opacity: 0,
        y: 30,
        filter: "blur(10px)",
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.6,
        stagger: {
          amount: 0.6,
          from: "start",
        },
        ease: "power3.out",
        delay: 0.5,
      }
    );
  }, [prefersReducedMotion, text]);

  const splitText = (text: string) => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className="char inline-block"
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <h1 ref={titleRef} className={className}>
      {splitText(text)}
    </h1>
  );
}
