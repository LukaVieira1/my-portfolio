import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useTranslation } from "react-i18next";

import { useScrollToSection } from "./hooks/useScrollToSection";
import { useLenis } from "./hooks/useLenis";
import { useActiveSection } from "./hooks/useActiveSection";

import { SplashScreen } from "./components/SplashScreen";
import { SettingsMenu } from "./components/SettingsMenu";
import { ScrollScene } from "./components/scrollytelling/ScrollScene";
import { ChapterAbout } from "./components/chapters/ChapterAbout";
import { ChapterExperience } from "./components/chapters/ChapterExperience";
import { ChapterProjects } from "./components/chapters/ChapterProjects";
import { ChapterContact } from "./components/chapters/ChapterContact";

import { navItems, getExperiences, getProjects } from "./data";
import { assert } from "./lib/assert";

const SECTION_IDS = ["about", "experience", "projects", "contact"];

function App() {
  const { t, i18n } = useTranslation();
  const scrollToSection = useScrollToSection();
  const [loading, setLoading] = useState(true);

  useLenis();
  const activeSection = useActiveSection(SECTION_IDS);

  const { scrollYProgress } = useScroll();
  const progressScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.85], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.08]);
  const subtitleY = useTransform(heroScroll, [0, 1], ["0%", "60%"]);

  const experiences = getExperiences(t);
  const projects = getProjects(t);
  const navigation = navItems(t);

  assert(experiences.length > 0, "no experiences");
  assert(projects.length > 0, "no projects");
  assert(navigation.length === SECTION_IDS.length, "nav mismatch");

  // narrativa visual: todos os projetos num filmstrip (profissionais primeiro)
  const storyProjects = [
    ...projects.filter((p) => !p.isPersonal),
    ...projects.filter((p) => p.isPersonal),
  ];
  assert(storyProjects.length === projects.length, "project partition failed");

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="noise-overlay atmosphere relative min-h-screen text-text-secondary">
      <ScrollScene />

      <motion.div
        className="fixed top-0 left-0 right-0 z-[9997] h-[2px] origin-left bg-primary"
        style={{ scaleX: progressScaleX }}
      />

      <AnimatePresence mode="wait">
        {loading ? (
          <SplashScreen key="splash" />
        ) : (
          <motion.div
            key={`content-${i18n.language}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="relative z-10"
          >
            <nav className="pointer-events-none fixed inset-x-0 top-0 z-50 px-6 py-5 md:px-10">
              <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between">
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="font-display text-sm font-bold tracking-tight text-text-primary md:text-base"
                >
                  {t("header.logo")}
                </button>

                <div className="hidden items-center gap-7 font-mono text-sm md:flex">
                  {navigation.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={`transition-colors ${
                        activeSection === item.id
                          ? "text-primary"
                          : "text-text-primary hover:text-primary"
                      }`}
                    >
                      <span className="text-primary">0{i + 1}.</span> {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </nav>

            {/* HERO — uma composição, brand dominante, parallax tipográfico */}
            <section
              ref={heroRef}
              className="relative flex min-h-screen items-end overflow-hidden px-6 pb-20 pt-28 md:px-10 md:pb-24"
            >
              <motion.div
                style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
                className="relative z-10 mx-auto w-full max-w-6xl origin-bottom-left"
              >
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.6 }}
                  className="font-mono text-sm text-primary md:text-base"
                >
                  {t("hero.greeting")}
                </motion.p>

                <motion.h1
                  initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
                  animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-3 font-display text-[clamp(3.5rem,14vw,9.5rem)] font-extrabold leading-[0.88] tracking-tight text-text-primary"
                >
                  {t("hero.name")}
                </motion.h1>

                <motion.div style={{ y: subtitleY }} className="mt-8 max-w-xl">
                  <p className="text-lg text-text-secondary md:text-xl">
                    {t("hero.description")}
                  </p>
                  <button
                    type="button"
                    onClick={() => scrollToSection("about")}
                    className="mt-8 border border-primary px-7 py-3 font-mono text-sm text-primary transition-colors hover:bg-primary/10"
                  >
                    {t("header.nav.about")} →
                  </button>
                </motion.div>
              </motion.div>

              <motion.div
                className="absolute bottom-8 left-1/2 h-14 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-primary"
                animate={{ scaleY: [0.45, 1, 0.45], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </section>

            <ChapterAbout />
            <ChapterExperience experiences={experiences} />
            <ChapterProjects projects={storyProjects} />
            <ChapterContact />

            <SettingsMenu />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
