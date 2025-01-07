import { motion } from "framer-motion";
import { ExperienceCard } from "./components/ExperienceCard";
import { useScrollToSection } from "./hooks/useScrollToSection";
import { ParticlesBackground } from "./components/ParticlesBackground";

function App() {
  const scrollToSection = useScrollToSection();

  const navItems = [
    { name: "Sobre", id: "sobre" },
    { name: "Experiência", id: "experiencia" },
    { name: "Projetos", id: "projetos" },
    { name: "Contato", id: "contato" },
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

  const aboutMeParagraphs = [
    "Há mais de 6 anos mergulhado no universo da tecnologia, encontrei minha verdadeira paixão no desenvolvimento Frontend. Nos últimos 3 anos, venho construindo interfaces que não são apenas bonitas, mas também intuitivas e funcionais.",
    "Minha jornada começou no suporte técnico, onde desenvolvi um olhar aguçado para resolução de problemas e empatia com o usuário final. Hoje, transformo esse background em aplicações web que fazem a diferença, sempre focando na experiência do usuário e nas melhores práticas de desenvolvimento.",
  ];

  return (
    <div className="min-h-screen bg-[#0a192f] text-[#8892b0] relative overflow-hidden">
      <ParticlesBackground />

      <div className="fixed left-8 bottom-0 hidden lg:block">
        <motion.div
          className="w-px h-32 bg-[#64ffda] opacity-20"
          initial={{ height: 0 }}
          animate={{ height: 128 }}
          transition={{ delay: 1 }}
        />
      </div>

      <div className="fixed right-8 bottom-0 hidden lg:block">
        <motion.div
          className="w-px h-32 bg-[#64ffda] opacity-20"
          initial={{ height: 0 }}
          animate={{ height: 128 }}
          transition={{ delay: 1 }}
        />
      </div>

      {/* Header */}
      <nav className="fixed w-full px-8 py-4 bg-[#0a192f]/90 backdrop-blur-sm z-50">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#64ffda] font-mono"
          >
            luka-vieira.dev
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
                className="text-[#ccd6f6] hover:text-[#64ffda] transition-colors cursor-pointer"
              >
                <span className="text-[#64ffda]">0{i + 1}.</span> {item.name}
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-8 pt-24">
        <section className="py-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#64ffda] font-mono mb-5"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              &gt; Olá, me chamo
            </motion.span>
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-[#ccd6f6] mb-4"
          >
            Luka Vieira.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg mb-8"
          >
            Desenvolvedor Frontend focado em criar experiências digitais
            excepcionais
          </motion.p>
        </section>

        {/* About Section */}
        <section id="sobre" className="py-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center text-2xl font-bold text-[#ccd6f6] mb-8"
          >
            <span className="text-[#64ffda] font-mono mr-2">01.</span>
            Sobre Mim
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {aboutMeParagraphs.map((paragraph, index) => (
                <p key={index} className="text-[#8892b0] leading-relaxed">
                  {paragraph}
                </p>
              ))}

              <p className="mt-8">
                Principais tecnologias com as quais trabalho:
              </p>
              <ul className="grid grid-cols-2 gap-2 font-mono text-sm">
                {mainTechs.map((tech) => (
                  <motion.li
                    key={tech}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center before:content-['▹'] before:text-[#64ffda] before:mr-2"
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
                className="absolute inset-0 border-2 border-[#64ffda] rounded-lg 
                           translate-x-4 translate-y-4 group-hover:translate-x-2 
                           group-hover:translate-y-2 transition-transform duration-300"
              />
            </motion.div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experiencia" className="py-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center text-2xl font-bold text-[#ccd6f6] mb-8"
          >
            <span className="text-[#64ffda] font-mono mr-2">02.</span>
            Onde Trabalhei
          </motion.h2>
          <div>
            <ExperienceCard
              company="Nome da Empresa"
              role="Frontend Developer"
              period="Jan 2022 - Presente"
              description="Desenvolvimento de aplicações web com React, TypeScript e outras tecnologias modernas."
              technologies={["React", "TypeScript", "Redux"]}
            />
            <ExperienceCard
              company="Outra Empresa"
              role="Frontend Developer Jr"
              period="Jan 2021 - Dez 2021"
              description="Desenvolvimento e manutenção de interfaces web responsivas."
              technologies={["Vue.js", "JavaScript", "SCSS"]}
            />
          </div>
        </section>

        {/* Projetos Section */}
        <section id="projetos" className="py-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center text-2xl font-bold text-[#ccd6f6] mb-12"
          >
            <span className="text-[#64ffda] font-mono mr-2">03.</span>
            Alguns Projetos
          </motion.h2>
          <div className="space-y-32">
            {/* Projeto 1 */}
            <motion.div
              className="relative md:grid md:grid-cols-12 gap-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="md:col-span-8 relative group">
                <a
                  href="https://seu-projeto.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src="/projeto1.jpg"
                      alt="E-commerce Dashboard"
                      className="w-full transition-all duration-300 
                               filter brightness-50 hover:brightness-100 
                               hover:scale-105 transform"
                    />
                    <div className="absolute inset-0 bg-[#0a192f]/50 group-hover:bg-transparent transition-all duration-300" />
                  </div>
                </a>
              </div>

              <div className="md:col-span-6 md:col-start-7 relative z-10 md:absolute inset-y-0 right-0">
                <div className="bg-[#112240] p-6 rounded-lg h-full shadow-xl">
                  <p className="text-[#64ffda] font-mono text-sm mb-2">
                    Projeto em Destaque
                  </p>
                  <h3 className="text-[#ccd6f6] text-xl font-bold mb-4">
                    E-commerce Dashboard
                  </h3>
                  <div className="text-[#8892b0] mb-4">
                    Dashboard para gerenciamento de e-commerce com análise de
                    dados em tempo real, gestão de produtos e relatórios
                    personalizados.
                  </div>
                  <div className="flex flex-wrap gap-2 font-mono text-sm text-[#64ffda]">
                    <span>React</span>
                    <span>TypeScript</span>
                    <span>Tailwind</span>
                    <span>Chart.js</span>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <a
                      href="https://github.com/seu-usuario/projeto"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#ccd6f6] hover:text-[#64ffda] transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                    <a
                      href="https://seu-projeto.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#ccd6f6] hover:text-[#64ffda] transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contato" className="py-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center text-2xl font-bold text-[#ccd6f6] mb-8"
          >
            <span className="text-[#64ffda] font-mono mr-2">04.</span>
            Vamos Conversar?
          </motion.h2>
          <div className="space-y-4">
            <p>
              Estou sempre aberto a novas oportunidades. Se você tem um projeto
              interessante ou só quer bater um papo, me manda uma mensagem!
            </p>
            <motion.div className="flex flex-col space-y-4">
              <motion.a
                href="mailto:lukavieira14@gmail.com"
                className="flex items-center before:content-['▹'] before:text-[#64ffda] before:mr-2 hover:text-[#64ffda] transition-colors"
              >
                lukavieira14@gmail.com
              </motion.a>
              <motion.a
                href="https://github.com/LukaVieira1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center before:content-['▹'] before:text-[#64ffda] before:mr-2 hover:text-[#64ffda] transition-colors"
              >
                GitHub
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/lukaviera/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center before:content-['▹'] before:text-[#64ffda] before:mr-2 hover:text-[#64ffda] transition-colors"
              >
                LinkedIn
              </motion.a>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
