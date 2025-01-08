import { motion } from "framer-motion";
import { useScrollToSection } from "./hooks/useScrollToSection";
import { ParticlesBackground } from "./components/ParticlesBackground";
import { useState } from "react";
import { ExperienceTimeline } from "./components/ExperienceTimeline";
import { ProjectCarousel } from "./components/ProjectCarousel";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { FiMail, FiLinkedin, FiGithub } from "react-icons/fi";

function App() {
  const { t } = useTranslation();
  const scrollToSection = useScrollToSection();
  const [projectType, setProjectType] = useState<"professional" | "personal">(
    "professional"
  );

  const navItems = [
    { name: t("header.nav.about"), id: "about" },
    { name: t("header.nav.experience"), id: "experience" },
    { name: t("header.nav.projects"), id: "projects" },
    { name: t("header.nav.contact"), id: "contact" },
  ];

  const mainTechs = [
    "JavaScript (ES6+)",
    "TypeScript",
    "React",
    "Vue",
    "Next.js",
    "Nuxt.js",
    "Node.js",
    "Tailwind CSS",
    "Axios",
    "React Query",
    "Zustand",
    "Cypress",
    "Git",
    "Framer Motion",
  ];

  const aboutMeParagraphs = [t("about.paragraphs.0"), t("about.paragraphs.1")];

  const experiences = [
    {
      company: t("experience.getHub.company"),
      role: t("experience.getHub.role"),
      period: t("experience.getHub.period"),
      link: "https://www.linkedin.com/company/getbuyhub/",
      description: [
        t("experience.getHub.description.0"),
        t("experience.getHub.description.1"),
        t("experience.getHub.description.2"),
        t("experience.getHub.description.3"),
      ],
      technologies: [
        "Next.js",
        "Tailwind CSS",
        "React Query",
        "XState",
        "React Hook Form",
        "Axios",
        "Cypress",
        "Ruby",
      ],
    },
    {
      company: t("experience.beMobile.company"),
      role: t("experience.beMobile.role"),
      period: t("experience.beMobile.period"),
      link: "https://bemobile.tech",
      description: [
        t("experience.beMobile.description.0"),
        t("experience.beMobile.description.1"),
        t("experience.beMobile.description.2"),
        t("experience.beMobile.description.3"),
      ],
      technologies: [
        "jQuery",
        "Nuxt.js",
        "React",
        "Tailwind CSS",
        "XState",
        "Redux",
        "Axios",
        "Git",
        "Laravel",
      ],
    },
    {
      company: t("experience.aggrandize.company"),
      link: "https://aggrandize.com.br/",
      role: t("experience.aggrandize.role"),
      period: t("experience.aggrandize.period"),
      description: [
        t("experience.aggrandize.description.0"),
        t("experience.aggrandize.description.1"),
        t("experience.aggrandize.description.2"),
        t("experience.aggrandize.description.3"),
      ],
      technologies: [
        "Oracle Cloud Infrastructure (OCI)",
        "Linux",
        "SQL",
        "Suporte Técnico",
      ],
    },
    {
      company: t("experience.cmcgu.company"),
      link: "https://www.camaracangucu.rs.gov.br/",
      role: t("experience.cmcgu.role"),
      period: t("experience.cmcgu.period"),
      description: [
        t("experience.cmcgu.description.0"),
        t("experience.cmcgu.description.1"),
        t("experience.cmcgu.description.2"),
        t("experience.cmcgu.description.3"),
      ],
      technologies: [
        "Hardware",
        "Sistemas Operacionais",
        "Redes",
        "Suporte Técnico",
      ],
    },
  ];

  const projects = [
    {
      title: t("projects.getHub.title"),
      description: [
        t("projects.getHub.description.0"),
        t("projects.getHub.description.1"),
        t("projects.getHub.description.2"),
      ],
      link: "https://www.linkedin.com/company/getbuyhub/",
      technologies: [
        "Next.js",
        "Tailwind CSS",
        "React Query",
        "XState",
        "React Hook Form",
        "Axios",
        "Cypress",
      ],
      isPersonal: false,
      image: "/projects/gethub.png",
    },
    {
      title: t("projects.meupass.title"),
      description: [
        t("projects.meupass.description.0"),
        t("projects.meupass.description.1"),
        t("projects.meupass.description.2"),
      ],
      technologies: [
        "Next.js",
        "TypeScript",
        "Tailwind",
        "Axios",
        "Framer Motion",
      ],
      link: "https://token.meupass.com.br/",
      isPersonal: false,
      image: "/projects/meupass.png",
    },
    {
      title: t("projects.souplenus.title"),
      description: [
        t("projects.souplenus.description.0"),
        t("projects.souplenus.description.1"),
        t("projects.souplenus.description.2"),
      ],
      technologies: ["Nuxt.js", "Tailwind", "React Query"],
      link: "https://www.souplenus.com.br/",
      isPersonal: false,
      image: "/projects/souplenus.png",
    },
    {
      title: t("projects.awari.title"),
      description: [
        t("projects.awari.description.0"),
        t("projects.awari.description.1"),
        t("projects.awari.description.2"),
        t("projects.awari.description.3"),
      ],
      technologies: ["JQuery", "Laravel", "PHP", "React", "TypeScript"],
      link: "https://awari.com.br/",
      isPersonal: false,
      image: "/projects/awari.png",
    },
    {
      title: t("projects.mpi.title"),
      description: [
        t("projects.mpi.description.0"),
        t("projects.mpi.description.1"),
      ],
      technologies: ["Vue 3", "Tailwind", "TypeScript", "Axios"],
      link: "https://mpiinformatica.com/sistema-de-gestao/",
      isPersonal: false,
      image: "/projects/mpi.jpeg",
    },
    {
      title: t("projects.atlas.title"),
      description: [
        t("projects.atlas.description.0"),
        t("projects.atlas.description.1"),
      ],
      technologies: ["React", "Tailwind", "TypeScript", "Axios", "Redux"],
      link: "https://welcome.atlasgov.com/",
      isPersonal: false,
      image: "/projects/atlas.jpeg",
    },
    {
      title: t("projects.tetris.title"),
      description: [
        t("projects.tetris.description.0"),
        t("projects.tetris.description.1"),
        t("projects.tetris.description.2"),
        t("projects.tetris.description.3"),
      ],
      technologies: [
        "React",
        "Tailwind",
        "TypeScript",
        "Vite",
        "Framer Motion",
        "i18n",
      ],
      link: "https://tetris.lukavieira.tech/",
      githubLink: "https://github.com/LukaVieira1/tetris",
      isPersonal: true,
      image: "/projects/tetris.png",
    },
    {
      title: t("projects.petwiiter.title"),
      description: [
        t("projects.petwiiter.description.0"),
        t("projects.petwiiter.description.1"),
        t("projects.petwiiter.description.2"),
        t("projects.petwiiter.description.3"),
      ],
      technologies: [
        "React",
        "Chakra UI",
        "Axios",
        "Node.js",
        "Fastify",
        "PostgreSQL",
        "Prisma",
      ],
      link: "https://petwitter.lukavieira.tech/",
      githubLink:
        "https://github.com/LukaVieira1/FinalProject-Petwitter-FrontEnd",
      isPersonal: true,
      image: "/projects/petwitter.png",
    },
  ];

  const filteredProjects = projects.filter(
    (project) => project.isPersonal === (projectType === "personal")
  );

  return (
    <div className="min-h-screen bg-background text-text-secondary relative">
      <ParticlesBackground />
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
              {navItems.map((item, i) => (
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
                  <span className="text-primary">0{i + 1}.</span> {item.name}
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

            <ProjectCarousel projects={filteredProjects} key={projectType} />
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
    </div>
  );
}

export default App;
