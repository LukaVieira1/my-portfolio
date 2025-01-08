// React
import { useState, useEffect } from "react";

// Framer Motion
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

// Hooks
import { useScrollToSection } from "./hooks/useScrollToSection";
import { useTranslation } from "react-i18next";

// Components
import { ParticlesBackground } from "./components/ParticlesBackground";
import { ExperienceTimeline } from "./components/ExperienceTimeline";
import { ProjectCarousel } from "./components/ProjectCarousel";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { SplashScreen } from "./components/SplashScreen";

// Icons
import { FiMail, FiLinkedin, FiGithub } from "react-icons/fi";

// Data
import { navItems, mainTechs, getExperiences, getProjects } from "./data";

function App() {
  const { t } = useTranslation();
  const scrollToSection = useScrollToSection();
  const [projectType, setProjectType] = useState<"professional" | "personal">(
    "professional"
  );
  const [loading, setLoading] = useState(true);

  const aboutMeParagraphs = [t("about.paragraphs.0"), t("about.paragraphs.1")];
  const experiences = getExperiences(t);
  const projects = getProjects(t);
  const navigation = navItems(t);

  const filteredProjects = projects.filter(
    (project) => project.isPersonal === (projectType === "personal")
  );

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen bg-background text-text-secondary relative">
      <ParticlesBackground />
      <AnimatePresence mode="wait">
        {loading ? (
          <SplashScreen key="splash" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              ease: "easeOut",
            }}
            className="relative z-1"
          >
            <div className="relative z-1">
              {/* Header */}
              <nav className="fixed w-full px-8 py-4 bg-background/90 backdrop-blur-sm z-50">
                <div className="max-w-3xl mx-auto flex justify-between items-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-primary font-mono"
                  >
                    {t("header.logo")}
                  </motion.div>
                  <div className="hidden md:flex space-x-8 font-mono text-sm">
                    {navigation.map((item, i) => (
                      <motion.button
                        key={item.name}
                        onClick={() => scrollToSection(item.id)}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="text-text-primary hover:text-primary transition-colors cursor-pointer"
                      >
                        <span className="text-primary">0{i + 1}.</span>{" "}
                        {item.name}
                      </motion.button>
                    ))}
                  </div>
                  <LanguageSwitcher />
                </div>
              </nav>

              {/* Main Content */}
              <div className="max-w-3xl mx-auto px-8 pt-24">
                <section className="py-20">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-primary font-mono mb-5"
                  >
                    {t("hero.greeting")}
                  </motion.p>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl font-bold text-text-primary mb-4"
                  >
                    {t("hero.name")}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg mb-8"
                  >
                    {t("hero.description")}
                  </motion.p>
                </section>

                {/* About Section */}
                <section id="about" className="py-20">
                  <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex items-center text-2xl font-bold text-text-primary mb-8"
                  >
                    <span className="text-primary font-mono mr-2">01.</span>
                    {t("about.title")}
                  </motion.h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                      {aboutMeParagraphs.map((paragraph, index) => (
                        <p
                          key={index}
                          className="text-text-secondary leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}

                      <p className="mt-8">{t("about.mainTechs")}</p>
                      <ul className="grid grid-cols-2 gap-2 font-mono text-sm">
                        {mainTechs.map((tech) => (
                          <motion.li
                            key={tech}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center before:content-['▹'] before:text-primary before:mr-2"
                          >
                            {tech}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <motion.div
                      className="relative group w-[250px] h-[250px]"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative z-10 rounded-lg overflow-hidden w-full h-full">
                        <img
                          src="/profile-pic.jpeg"
                          alt="Luka Vieira"
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                      <div
                        className="absolute inset-0 border-2 border-primary rounded-lg 
                                   translate-x-4 translate-y-4 group-hover:translate-x-2 
                                   group-hover:translate-y-2 transition-transform duration-300"
                      />
                    </motion.div>
                  </div>
                </section>

                {/* Experience Section */}
                <section id="experience" className="py-20">
                  <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex items-center text-2xl font-bold text-text-primary mb-8"
                  >
                    <span className="text-primary font-mono mr-2">02.</span>
                    {t("experience.title")}
                  </motion.h2>
                  <ExperienceTimeline experiences={experiences} />
                </section>

                {/* Projects Section */}
                <section id="projects" className="py-20">
                  <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex items-center text-2xl font-bold text-text-primary mb-8"
                  >
                    <span className="text-primary font-mono mr-2">03.</span>
                    {t("projects.title")}
                  </motion.h2>

                  <div className="flex justify-center mb-12">
                    <div className="relative flex items-center bg-background-light/50 rounded-full p-1 backdrop-blur-sm">
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
                        className={`relative px-6 py-2 text-sm font-medium rounded-full ${
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
                        className={`relative px-6 py-2 text-sm font-medium rounded-full ${
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
                  />
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-32">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto px-8"
                  >
                    <motion.h2
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
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
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-mono 
                          hover:bg-primary/10 transition-colors flex items-center gap-3"
                      >
                        <FiMail size={20} />
                        lukavieira14@gmail.com
                      </motion.a>

                      <div className="flex gap-6">
                        <motion.a
                          href="https://www.linkedin.com/in/lukaviera/"
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-text-secondary hover:text-primary transition-colors"
                        >
                          <FiLinkedin size={24} />
                        </motion.a>
                        <motion.a
                          href="https://github.com/LukaVieira1"
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-text-secondary hover:text-primary transition-colors"
                        >
                          <FiGithub size={24} />
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                </section>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ParticlesBackground />
    </div>
  );
}

export default App;
