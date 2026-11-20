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
import { GhostType } from "./components/GhostType";
import { ChapterAbout } from "./components/chapters/ChapterAbout";
import { ChapterStack } from "./components/chapters/ChapterStack";
import { ChapterExperience } from "./components/chapters/ChapterExperience";
import { ChapterProjects } from "./components/chapters/ChapterProjects";
import { ChapterContact } from "./components/chapters/ChapterContact";

import { navItems, getExperiences, getProjects } from "./data";
import { assert } from "./lib/assert";
import { filterCoreStackProjects } from "./lib/coreStack";

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
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "22%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.85], [1, 0]);
  const subtitleY = useTransform(heroScroll, [0, 1], ["0%", "40%"]);

  const experiences = getExperiences(t);
  const projects = getProjects(t);
  const navigation = navItems(t);
  const heroName = t("hero.name");

  assert(experiences.length > 0, "no experiences");
  assert(projects.length > 0, "no projects");
  assert(heroName.length > 0, "hero name missing");
  assert(navigation.length === SECTION_IDS.length, "nav mismatch");

  const storyProjects = filterCoreStackProjects([
    ...projects.filter((p) => !p.isPersonal),
    ...projects.filter((p) => p.isPersonal),
  ]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1200);
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
            <nav className="pointer-events-none fixed inset-x-0 top-0 z-50 border-b border-text-primary/5 bg-background/80 px-5 py-4 backdrop-blur-md md:px-10 md:py-5">
              <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="font-display text-sm font-bold tracking-tight text-text-primary md:text-base"
                >
                  {t("header.logo")}
                </button>

                <div className="flex items-center gap-3 font-mono text-xs md:gap-7 md:text-sm">
                  {navigation.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={`shrink-0 transition-colors ${
                        activeSection === item.id
                          ? "text-primary"
                          : "text-text-primary hover:text-primary"
                      }`}
                      aria-label={item.name}
                    >
                      <span className="text-primary">0{i + 1}.</span>
                      <span className="hidden md:inline"> {item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </nav>

            {/* HERO — ghost lettering editorial */}
            <section
              ref={heroRef}
              className="relative flex min-h-[100svh] items-end overflow-hidden px-5 pb-16 pt-28 md:px-10 md:pb-28 md:pt-32"
            >
              <motion.div
                style={{ y: heroY, opacity: heroOpacity }}
                className="relative z-10 mx-auto w-full max-w-6xl"
              >
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.55 }}
                  className="font-mono text-sm text-primary md:text-base"
                >
                  {t("hero.greeting")}
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-4 font-display text-[clamp(2.75rem,11vw,8.75rem)] font-extrabold leading-[0.92] tracking-tight text-text-primary"
                >
                  <GhostType text={heroName} className="block max-w-full" />
                </motion.h1>

                <motion.div style={{ y: subtitleY }} className="mt-8 max-w-lg md:mt-10">
                  <p className="text-lg text-text-secondary md:text-2xl">
                    {t("hero.description")}
                  </p>
                  <button
                    type="button"
                    onClick={() => scrollToSection("about")}
                    className="mt-8 font-mono text-sm text-primary transition-opacity hover:opacity-70"
                  >
                    {t("header.nav.about")} →
                  </button>
                </motion.div>
              </motion.div>
            </section>

            <ChapterAbout />
            <ChapterStack />
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
