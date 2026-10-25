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

  // Kinetic transformations driven by scroll
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(() => {
    if (!nameRef.current || prefersReducedMotion) return;

    const chars = nameRef.current.querySelectorAll(".kinetic-char");

    gsap.fromTo(
      chars,
      {
        opacity: 0,
        y: 80,
        scale: 0.4,
        filter: "blur(12px)",
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.9,
        stagger: 0.04,
        ease: "back.out(1.5)",
        delay: 0.3,
      }
    );
  }, [prefersReducedMotion, name]);

  const splitText = (text: string) => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className="kinetic-char inline-block"
        style={{ transformOrigin: "center center" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-[90vh] flex flex-col justify-center py-20"
    >
      <motion.div
        style={{
          scale: prefersReducedMotion ? 1 : scale,
          opacity: prefersReducedMotion ? 1 : opacity,
          y: prefersReducedMotion ? 0 : y,
        }}
        className="relative z-10"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-primary font-mono mb-5 text-lg"
        >
          {greeting}
        </motion.p>

        <h1
          ref={nameRef}
          className="text-6xl md:text-8xl font-bold text-text-primary mb-6 leading-tight"
        >
          {splitText(name)}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="text-xl md:text-2xl mb-12 max-w-2xl text-text-secondary"
        >
          {description}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          onClick={onCtaClick}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 30px rgba(100,255,218,0.3)",
          }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-mono text-lg hover:bg-primary/10 transition-colors"
        >
          {ctaText} →
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
      >
        <motion.div
          className="w-px h-16 bg-gradient-to-b from-transparent via-primary to-transparent"
          animate={{
            scaleY: [0.5, 1, 0.5],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </section>
  );
}
