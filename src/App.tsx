import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { useTranslation } from "react-i18next";

import { useScrollToSection } from "./hooks/useScrollToSection";
import { useLenis } from "./hooks/useLenis";
import { useActiveSection } from "./hooks/useActiveSection";

import { ExperienceTimeline } from "./components/ExperienceTimeline";
import { ProjectCarousel } from "./components/ProjectCarousel";
import { SplashScreen } from "./components/SplashScreen";
import { SettingsMenu } from "./components/SettingsMenu";
import { KineticHero } from "./components/KineticHero";
import { SectionTitleReveal } from "./components/SectionTitleReveal";
import { ClipPathReveal } from "./components/ClipPathReveal";
import { ScrollReactiveMarquee } from "./components/ScrollReactiveMarquee";
import { AnimatedCounter } from "./components/AnimatedCounter";
import { ScrollSpotlight } from "./components/ScrollSpotlight";

import { FiMail, FiLinkedin, FiGithub } from "react-icons/fi";

import { navItems, mainTechs, getExperiences, getProjects } from "./data";

const SECTION_IDS = ["about", "experience", "projects", "contact"];

function App() {
  const { t, i18n } = useTranslation();
  const scrollToSection = useScrollToSection();
  const [projectType, setProjectType] = useState<"professional" | "personal">(
    "professional",
  );
  const [loading, setLoading] = useState(true);

  useLenis();

  const activeSection = useActiveSection(SECTION_IDS);

  const { scrollYProgress } = useScroll();
  const progressScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const aboutMeParagraphs = [t("about.paragraphs.0"), t("about.paragraphs.1")];
  const experiences = getExperiences(t);
  const projects = getProjects(t);
  const navigation = navItems(t);

  const filteredProjects = projects.filter(
    (project) => project.isPersonal === (projectType === "personal"),
  );

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="noise-overlay min-h-screen bg-background text-text-secondary relative">
      <ScrollSpotlight />
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-[9997] origin-left shadow-[0_0_8px_rgba(100,255,218,0.5)]"
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative z-10"
          >
            <motion.nav
              className="fixed w-full px-8 py-4 bg-background/90 backdrop-blur-sm z-50"
              initial={{ y: -80 }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="max-w-3xl mx-auto flex items-center justify-between">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-primary font-mono"
                >
                  {t("header.logo")}
                </motion.div>

                <div className="hidden md:flex items-center space-x-8 font-mono text-sm">
                  {navigation.map((item, i) => (
                    <motion.button
                      key={item.name}
                      onClick={() => scrollToSection(item.id)}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className={`relative transition-colors ${
                        activeSection === item.id
                          ? "text-primary"
                          : "text-text-primary hover:text-primary"
                      }`}
                    >
                      <span className="text-primary">0{i + 1}.</span>{" "}
                      {item.name}
                      {activeSection === item.id && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute -bottom-1 left-0 right-0 h-px bg-primary"
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 30,
                          }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.nav>

            <div className="max-w-3xl mx-auto px-8 pt-24">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`sections-${i18n.language}`}
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.8 }}
                  transition={{ duration: 0.2, ease: "linear" }}
                >
                  <KineticHero
                    greeting={t("hero.greeting")}
                    name={t("hero.name")}
                    description={t("hero.description")}
                    ctaText={t("header.nav.about")}
                    onCtaClick={() => scrollToSection("about")}
                  />

                  <section id="about" className="py-20">
                    <SectionTitleReveal number="01" title={t("about.title")} />
                      <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-4">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex gap-8 mb-6"
                          >
                            <div className="text-center">
                              <div className="text-4xl font-bold text-primary">
                                <AnimatedCounter end={8} suffix="+" />
                              </div>
                              <div className="text-sm text-text-secondary mt-1">
                                {i18n.language === "pt-BR" ? "Anos em TI" : "Years in IT"}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-4xl font-bold text-primary">
                                <AnimatedCounter end={5} suffix="+" />
                              </div>
                              <div className="text-sm text-text-secondary mt-1">
                                {i18n.language === "pt-BR" ? "Anos Dev" : "Years Dev"}
                              </div>
                            </div>
                          </motion.div>

                          {aboutMeParagraphs.map((paragraph, index) => (
                            <motion.p
                              key={index}
                              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                              whileInView={{
                                opacity: 1,
                                y: 0,
                                filter: "blur(0px)",
                              }}
                              viewport={{ once: true }}
                              transition={{
                                delay: index * 0.15,
                                duration: 0.6,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="text-text-secondary leading-relaxed"
                            >
                              {paragraph}
                            </motion.p>
                          ))}

                          <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 mb-4"
                          >
                            {t("about.mainTechs")}
                          </motion.p>
                          <ScrollReactiveMarquee items={mainTechs} />
                        </div>
                        <motion.div
                          className="w-[250px] h-[250px]"
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <ClipPathReveal
                            src="/profile-pic.jpeg"
                            alt="Luka Vieira"
                            className="w-full h-full"
                          />
                        </motion.div>
                      </div>
                    </section>

                  <section id="experience" className="py-20">
                    <SectionTitleReveal number="02" title={t("experience.title")} />
                    <ExperienceTimeline experiences={experiences} />
                  </section>

                  <section id="projects" className="py-20">
                    <SectionTitleReveal number="03" title={t("projects.title")} />

                      <div className="flex justify-center mb-12">
                        <div className="relative flex items-center bg-background-light/50 rounded-full p-1 backdrop-blur-xs">
                          <motion.div
                            className="absolute h-full bg-primary/10 rounded-full"
                            initial={false}
                            animate={{
                              width: "50%",
                              x: projectType === "professional" ? "0%" : "100%",
                            }}
                            transition={{ duration: 0.2 }}
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setProjectType("professional")}
                            className={`relative px-6 py-2 text-sm font-medium rounded-full z-10 cursor-pointer ${
                              projectType === "professional"
                                ? "text-primary"
                                : "text-text-secondary hover:text-text-primary"
                            }`}
                          >
                            {t("projects.filters.professional")}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setProjectType("personal")}
                            className={`relative px-6 py-2 text-sm font-medium rounded-full z-10 cursor-pointer ${
                              projectType === "personal"
                                ? "text-primary"
                                : "text-text-secondary hover:text-text-primary"
                            }`}
                          >
                            {t("projects.filters.personal")}
                          </motion.button>
                        </div>
                      </div>

                      <ProjectCarousel
                        projects={filteredProjects}
                        key={projectType}
                        resetKey={projectType}
                      />
                    </section>

                  <section id="contact" className="py-32">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-center max-w-2xl mx-auto px-8"
                    >
                      <div className="flex justify-center mb-8">
                        <SectionTitleReveal number="04" title={t("contact.title")} />
                      </div>

                        <p className="text-lg mb-12 text-text-secondary">
                          {t("contact.description")}
                        </p>

                        <div className="flex flex-col items-center gap-8">
                          <motion.a
                            href="mailto:lukavieira14@gmail.com"
                            whileHover={{
                              scale: 1.05,
                              boxShadow: "0 0 25px rgba(100,255,218,0.2)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-mono hover:bg-primary/10 transition-colors flex items-center gap-3"
                          >
                            <FiMail size={20} />
                            lukavieira14@gmail.com
                          </motion.a>

                          <div className="flex gap-6">
                            <motion.a
                              href="https://www.linkedin.com/in/lukaviera/"
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.2, y: -3 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-text-secondary hover:text-primary transition-colors"
                            >
                              <FiLinkedin size={24} />
                            </motion.a>
                            <motion.a
                              href="https://github.com/LukaVieira1"
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.2, y: -3 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-text-secondary hover:text-primary transition-colors"
                            >
                              <FiGithub size={24} />
                            </motion.a>
                        </div>
                      </div>
                    </motion.div>
                  </section>
                </motion.div>
              </AnimatePresence>
            </div>
            <SettingsMenu />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
