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

import { FiMail, FiLinkedin, FiGithub } from "react-icons/fi";

import { navItems, mainTechs, getExperiences, getProjects } from "./data";

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
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
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
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.75], [1, 0]);

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
                  <section
                    ref={heroRef}
                    className="py-20 relative min-h-[75vh] flex flex-col justify-center"
                  >
                    <motion.div
                      style={{ y: heroY, opacity: heroOpacity }}
                      className="relative z-10"
                    >
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                      >
                        <motion.p
                          variants={fadeUpVariant}
                          className="text-primary font-mono mb-5"
                        >
                          {t("hero.greeting")}
                        </motion.p>
                        <motion.h1
                          variants={fadeUpVariant}
                          className="text-5xl md:text-6xl font-bold text-text-primary mb-4 leading-tight"
                        >
                          {t("hero.name")}
                        </motion.h1>
                        <motion.p
                          variants={fadeUpVariant}
                          className="text-lg mb-8 max-w-xl"
                        >
                          {t("hero.description")}
                        </motion.p>
                        <motion.div
                          variants={fadeUpVariant}
                          className="flex items-center gap-4 mt-8"
                        >
                          <motion.button
                            onClick={() => scrollToSection("about")}
                            whileHover={{
                              scale: 1.05,
                              boxShadow: "0 0 20px rgba(100,255,218,0.2)",
                            }}
                            whileTap={{ scale: 0.97 }}
                            className="px-6 py-3 border border-primary text-primary rounded font-mono text-sm hover:bg-primary/10 transition-colors"
                          >
                            {t("header.nav.about")} →
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    </motion.div>

                    <motion.div
                      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.8 }}
                    >
                      <motion.div
                        className="w-px h-12 bg-gradient-to-b from-transparent to-primary"
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

                  <section id="about" className="py-20">
                    <motion.h2
                      variants={sectionTitleVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="flex items-center text-2xl font-bold text-text-primary mb-8"
                    >
                      <span className="text-primary font-mono mr-2">01.</span>
                      {t("about.title")}
                    </motion.h2>
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="md:col-span-2 space-y-4">
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
                          className="mt-8"
                        >
                          {t("about.mainTechs")}
                        </motion.p>
                        <ul className="grid grid-cols-2 gap-2 font-mono text-sm">
                          {mainTechs.map((tech, i) => (
                            <motion.li
                              key={tech}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.06, duration: 0.4 }}
                              className="flex items-center before:content-['▹'] before:text-primary before:mr-2"
                            >
                              {tech}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      <motion.div
                        className="relative group w-[250px] h-[250px]"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="relative z-10 rounded-lg overflow-hidden w-full h-full">
                          <img
                            src="/profile-pic.jpeg"
                            alt="Luka Vieira"
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                          />
                        </div>
                        <div className="absolute inset-0 border-2 border-primary rounded-lg translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300" />
                      </motion.div>
                    </div>
                  </section>

                  <section id="experience" className="py-20">
                    <motion.h2
                      variants={sectionTitleVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="flex items-center text-2xl font-bold text-text-primary mb-8"
                    >
                      <span className="text-primary font-mono mr-2">02.</span>
                      {t("experience.title")}
                    </motion.h2>
                    <ExperienceTimeline experiences={experiences} />
                  </section>

                  <section id="projects" className="py-20">
                    <motion.h2
                      variants={sectionTitleVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="flex items-center text-2xl font-bold text-text-primary mb-8"
                    >
                      <span className="text-primary font-mono mr-2">03.</span>
                      {t("projects.title")}
                    </motion.h2>

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
                      <motion.h2
                        variants={sectionTitleVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="flex items-center justify-center text-2xl font-bold text-text-primary mb-8"
                      >
                        <span className="text-primary font-mono mr-2">04.</span>
                        {t("contact.title")}
                      </motion.h2>

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
