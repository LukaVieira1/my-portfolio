import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "../hooks/useGSAP";

interface KineticHeroProps {
  greeting: string;
  name: string;
  description: string;
  onCtaClick: () => void;
  ctaText: string;
}

export function KineticHero({
  greeting,
  name,
  description,
  onCtaClick,
  ctaText,
}: KineticHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const { prefersReducedMotion } = useGSAP();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const nameY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);

  useEffect(() => {
    if (!nameRef.current) return;

    const chars = nameRef.current.querySelectorAll(".kinetic-char");

    if (prefersReducedMotion) {
      gsap.set(chars, { opacity: 1, y: 0, scale: 1, filter: "none" });
      return;
    }

    gsap.fromTo(
      chars,
      { opacity: 0, y: 36, scale: 0.7 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.035,
        ease: "back.out(1.4)",
        delay: 0.15,
      },
    );
  }, [prefersReducedMotion, name]);

  const splitText = (text: string) =>
    text.split(" ").map((word, wordIndex, words) => (
      <span key={wordIndex} className="inline-block">
        {word.split("").map((char, charIndex) => (
          <span key={`${wordIndex}-${charIndex}`} className="kinetic-char inline-block">
            {char}
          </span>
        ))}
        {wordIndex < words.length - 1 ? "\u00A0" : null}
      </span>
    ));

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[75vh] flex-col justify-center overflow-hidden py-20"
    >
      <div className="relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mb-5 font-mono text-primary"
        >
          {greeting}
        </motion.p>

        <motion.h1
          ref={nameRef}
          style={
            prefersReducedMotion
              ? undefined
              : { y: nameY, opacity: nameOpacity }
          }
          className="mb-4 text-5xl font-bold leading-tight text-text-primary md:text-6xl"
        >
          {splitText(name)}
        </motion.h1>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.35 }}
          className="mb-8 max-w-xl text-lg text-text-secondary"
        >
          {description}
        </motion.p>

        <motion.button
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.45 }}
          onClick={onCtaClick}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 20px rgba(100,255,218,0.2)",
          }}
          whileTap={{ scale: 0.97 }}
          className="rounded border border-primary px-6 py-3 font-mono text-sm text-primary transition-colors hover:bg-primary/10"
        >
          {ctaText} →
        </motion.button>
      </div>
    </section>
  );
}
