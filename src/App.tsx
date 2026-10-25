import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import ScrollTrigger from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);
import { useTranslation } from "react-i18next";
import { useScrollToSection } from "./hooks/useScrollToSection";
import { useLenis } from "./hooks/useLenis";
import { useActiveSection } from "./hooks/useActiveSection";
import { SplashScreen } from "./components/SplashScreen";
import { SettingsMenu } from "./components/SettingsMenu";
import { HeroBoot } from "./components/HeroBoot";
import { AboutPanel } from "./components/AboutPanel";
import { ExperienceStage } from "./components/ExperienceStage";
import { ProjectStage } from "./components/ProjectStage";
import { ContactTerminal } from "./components/ContactTerminal";
import { navItems, getExperiences, getProjects } from "./data";

const SECTION_IDS = ["about", "experience", "projects", "contact"];

function App() {
  const { t, i18n } = useTranslation();
  const scrollToSection = useScrollToSection();
  const [loading, setLoading] = useState(true);
  const activeSection = useActiveSection(SECTION_IDS);
  const { scrollYProgress } = useScroll();
  const progressScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const navigation = navItems(t);

  useLenis();

  useEffect(() => {
    const id = window.setTimeout(() => setLoading(false), 1100);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (loading) return;
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => window.clearTimeout(id);
  }, [loading, i18n.language]);

  return (
    <div className="noise-overlay relative min-h-screen max-w-[100vw] overflow-x-clip bg-background text-text-secondary">
      <div className="site-grid pointer-events-none fixed inset-0 z-0 opacity-70" />
      <div className="site-scan pointer-events-none fixed inset-0 z-0 opacity-40" />

      <motion.div
        className="fixed left-0 right-0 top-0 z-[9997] h-[2px] origin-left bg-primary"
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
            className="relative z-10 min-w-0"
          >
            <nav className="fixed left-0 right-0 top-0 z-50 border-b border-primary/10 bg-background/80 px-5 py-3 backdrop-blur-md md:px-10">
              <div className="mx-auto flex max-w-5xl items-center justify-between">
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="font-mono text-xs text-primary md:text-sm"
                >
                  {t("header.logo")}
                </button>
                <div className="hidden items-center gap-5 font-mono text-xs md:flex">
                  {navigation.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={
                        activeSection === item.id
                          ? "text-primary"
                          : "text-text-secondary hover:text-primary"
                      }
                    >
                      <span className="text-primary">0{i + 1}.</span> {item.name}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 font-mono text-[11px] text-primary md:hidden">
                  {navigation.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                    >
                      0{i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </nav>

            <div className="mx-auto min-w-0 max-w-5xl">
              <HeroBoot
                greeting={t("hero.greeting")}
                name={t("hero.name")}
                description={t("hero.description")}
                ctaText={t("header.nav.about")}
                onCta={() => scrollToSection("about")}
              />
              <AboutPanel
                title={t("about.title")}
                paragraphs={[t("about.paragraphs.0"), t("about.paragraphs.1")]}
                techsLabel={t("about.mainTechs")}
              />
              <ExperienceStage
                key={`exp-${i18n.language}`}
                title={t("experience.title")}
                experiences={getExperiences(t)}
              />
              <ProjectStage
                key={`proj-${i18n.language}`}
                title={t("projects.title")}
                professionalLabel={t("projects.filters.professional")}
                personalLabel={t("projects.filters.personal")}
                projects={getProjects(t)}
              />
              <ContactTerminal
                title={t("contact.title")}
                description={t("contact.description")}
              />
            </div>
            <SettingsMenu />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
