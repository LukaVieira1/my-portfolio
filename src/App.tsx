import { useState, useEffect, useRef } from "react";
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
import { ScrollScene } from "./components/scrollytelling/ScrollScene";

import { FiMail, FiLinkedin, FiGithub } from "react-icons/fi";

import { navItems, mainTechs, getExperiences, getProjects } from "./data";
import { assert } from "./lib/assert";

const SECTION_IDS = ["about", "experience", "projects", "contact"];

const sectionTitleVariants = {
  hidden: { clipPath: "inset(0 100% 0 0)", opacity: 0 },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

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

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "18%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  const aboutMeParagraphs = [t("about.paragraphs.0"), t("about.paragraphs.1")];
  const experiences = getExperiences(t);
  const projects = getProjects(t);
  const navigation = navItems(t);

  assert(experiences.length > 0, "no experiences loaded");
  assert(projects.length > 0, "no projects loaded");
  assert(navigation.length === SECTION_IDS.length, "nav/section mismatch");

  const filteredProjects = projects.filter(
    (project) => project.isPersonal === (projectType === "personal"),
  );

  assert(
    filteredProjects.length > 0,
    `no projects for filter "${projectType}"`,
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 1600);
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
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="relative z-10"
          >
            <div className="mesh-pattern pointer-events-none fixed inset-0 z-[1]" />

            <motion.nav
              className="fixed z-50 w-full px-6 py-4 md:px-10"
              initial={{ y: -80 }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="mx-auto flex max-w-6xl items-center justify-between">
                <motion.button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="font-display text-sm font-bold tracking-tight text-text-primary md:text-base"
                >
                  {t("header.logo")}
                </motion.button>

                <div className="hidden items-center gap-8 font-mono text-sm md:flex">
                  {navigation.map((item, i) => (
                    <motion.button
                      key={item.name}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      initial={{ opacity: 0, y: -16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + i * 0.08 }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className={`relative transition-colors ${
                        activeSection === item.id
                          ? "text-primary"
                          : "text-text-primary hover:text-primary"
                      }`}
                    >
                      <span className="text-primary">0{i + 1}.</span> {item.name}
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

            <AnimatePresence mode="wait">
              <motion.div
                key={`sections-${i18n.language}`}
                initial={{ opacity: 0.85 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.85 }}
                transition={{ duration: 0.2, ease: "linear" }}
              >
                {/* HERO — full-bleed composition, brand first */}
                <section
                  ref={heroRef}
                  className="relative flex min-h-screen flex-col justify-center px-6 md:px-10"
                >
                  <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="relative z-10 mx-auto w-full max-w-6xl"
                  >
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="max-w-4xl"
                    >
                      <motion.p
                        variants={fadeUpVariant}
                        className="mb-4 font-mono text-sm text-primary md:text-base"
                      >
                        {t("hero.greeting")}
                      </motion.p>
                      <motion.h1
                        variants={fadeUpVariant}
                        className="font-display text-6xl font-extrabold leading-[0.95] tracking-tight text-text-primary sm:text-7xl md:text-8xl lg:text-9xl"
                      >
                        {t("hero.name")}
                      </motion.h1>
                      <motion.p
                        variants={fadeUpVariant}
                        className="mt-6 max-w-xl text-lg text-text-secondary md:text-xl"
                      >
                        {t("hero.description")}
                      </motion.p>
                      <motion.div variants={fadeUpVariant} className="mt-10">
                        <motion.button
                          type="button"
                          onClick={() => scrollToSection("about")}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.97 }}
                          className="border border-primary px-7 py-3 font-mono text-sm text-primary transition-colors hover:bg-primary/10"
                        >
                          {t("header.nav.about")} →
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                  >
                    <motion.div
                      className="h-14 w-px origin-top bg-gradient-to-b from-transparent to-primary"
                      animate={{
                        scaleY: [0.45, 1, 0.45],
                        opacity: [0.35, 1, 0.35],
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                </section>

                <div className="mx-auto max-w-6xl px-6 md:px-10">
                  {/* ABOUT */}
                  <section
                    id="about"
                    className="content-panel my-8 rounded-none py-28 md:my-12 md:py-36 px-6 md:px-10"
                  >
                    <motion.h2
                      variants={sectionTitleVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="mb-10 flex items-center font-display text-3xl font-bold text-text-primary md:text-4xl"
                    >
                      <span className="mr-3 font-mono text-lg text-primary">
                        01.
                      </span>
                      {t("about.title")}
                    </motion.h2>

                    <div className="grid gap-12 md:grid-cols-5 md:gap-16">
                      <div className="space-y-5 md:col-span-3">
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
                              delay: index * 0.12,
                              duration: 0.55,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="text-base leading-relaxed text-text-secondary md:text-lg"
                          >
                            {paragraph}
                          </motion.p>
                        ))}

                        <motion.p
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.25 }}
                          className="pt-4 font-medium text-text-primary"
                        >
                          {t("about.mainTechs")}
                        </motion.p>
                        <ul className="grid grid-cols-2 gap-2 font-mono text-sm">
                          {mainTechs.map((tech, i) => (
                            <motion.li
                              key={tech}
                              initial={{ opacity: 0, x: -16 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.04, duration: 0.35 }}
                              className="flex items-center before:mr-2 before:text-primary before:content-['▹']"
                            >
                              {tech}
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      <motion.div
                        className="relative mx-auto w-full max-w-[280px] md:col-span-2"
                        initial={{ opacity: 0, scale: 0.94 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="relative z-10 aspect-square overflow-hidden">
                          <img
                            src="/profile-pic.jpeg"
                            alt="Luka Vieira"
                            className="h-full w-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
                          />
                        </div>
                        <div className="absolute inset-0 translate-x-3 translate-y-3 border border-primary transition-transform duration-300 hover:translate-x-2 hover:translate-y-2" />
                      </motion.div>
                    </div>
                  </section>

                  {/* EXPERIENCE */}
                  <section
                    id="experience"
                    className="content-panel my-8 rounded-none py-28 md:my-12 md:py-36 px-6 md:px-10"
                  >
                    <motion.h2
                      variants={sectionTitleVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="mb-10 flex items-center font-display text-3xl font-bold text-text-primary md:text-4xl"
                    >
                      <span className="mr-3 font-mono text-lg text-primary">
                        02.
                      </span>
                      {t("experience.title")}
                    </motion.h2>
                    <ExperienceTimeline experiences={experiences} />
                  </section>

                  {/* PROJECTS */}
                  <section
                    id="projects"
                    className="content-panel my-8 rounded-none py-28 md:my-12 md:py-36 px-6 md:px-10"
                  >
                    <motion.h2
                      variants={sectionTitleVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="mb-10 flex items-center font-display text-3xl font-bold text-text-primary md:text-4xl"
                    >
                      <span className="mr-3 font-mono text-lg text-primary">
                        03.
                      </span>
                      {t("projects.title")}
                    </motion.h2>

                    <div className="mb-12 flex justify-center gap-8 font-mono text-sm">
                      {(
                        [
                          ["professional", t("projects.filters.professional")],
                          ["personal", t("projects.filters.personal")],
                        ] as const
                      ).map(([type, label]) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setProjectType(type)}
                          className={`relative pb-2 transition-colors ${
                            projectType === type
                              ? "text-primary"
                              : "text-text-secondary hover:text-text-primary"
                          }`}
                        >
                          {label}
                          {projectType === type && (
                            <motion.span
                              layoutId="project-filter"
                              className="absolute bottom-0 left-0 right-0 h-px bg-primary"
                            />
                          )}
                        </button>
                      ))}
                    </div>

                    <ProjectCarousel
                      projects={filteredProjects}
                      key={projectType}
                      resetKey={projectType}
                    />
                  </section>

                  {/* CONTACT */}
                  <section id="contact" className="py-32 md:py-40">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="mx-auto max-w-2xl px-2 text-center"
                    >
                      <motion.h2
                        variants={sectionTitleVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="mb-8 flex items-center justify-center font-display text-3xl font-bold text-text-primary md:text-4xl"
                      >
                        <span className="mr-3 font-mono text-lg text-primary">
                          04.
                        </span>
                        {t("contact.title")}
                      </motion.h2>

                      <p className="mb-12 text-lg text-text-secondary">
                        {t("contact.description")}
                      </p>

                      <div className="flex flex-col items-center gap-8">
                        <motion.a
                          href="mailto:lukavieira14@gmail.com"
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex items-center gap-3 border-2 border-primary px-8 py-4 font-mono text-primary transition-colors hover:bg-primary/10"
                        >
                          <FiMail size={20} />
                          lukavieira14@gmail.com
                        </motion.a>

                        <div className="flex gap-6">
                          <motion.a
                            href="https://www.linkedin.com/in/lukaviera/"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.92 }}
                            className="text-text-secondary transition-colors hover:text-primary"
                          >
                            <FiLinkedin size={24} />
                          </motion.a>
                          <motion.a
                            href="https://github.com/LukaVieira1"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.92 }}
                            className="text-text-secondary transition-colors hover:text-primary"
                          >
                            <FiGithub size={24} />
                          </motion.a>
                        </div>
                      </div>
                    </motion.div>
                  </section>
                </div>
              </motion.div>
            </AnimatePresence>

            <SettingsMenu />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
