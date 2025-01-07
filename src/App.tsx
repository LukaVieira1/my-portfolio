import { motion } from "framer-motion";
import { ExperienceCard } from "./components/ExperienceCard";
import { useScrollToSection } from "./hooks/useScrollToSection";

function App() {
  const scrollToSection = useScrollToSection();

  const navItems = [
    { name: "Sobre", id: "sobre" },
    { name: "Experiência", id: "experiencia" },
    { name: "Projetos", id: "projetos" },
    { name: "Contato", id: "contato" },
  ];

  return (
    <div className="min-h-screen bg-[#0a192f] text-[#8892b0]">
      {/* Header */}
      <nav className="fixed w-full px-8 py-4 bg-[#0a192f]/90 backdrop-blur-sm z-50">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#64ffda] font-mono"
          >
            seu-nome.dev
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
        {/* Intro Section */}
        <section className="py-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#64ffda] font-mono mb-5"
          >
            Olá, me chamo
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-[#ccd6f6] mb-4"
          >
            Seu Nome.
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

        {/* Sobre Section */}
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
          <div className="space-y-4">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p>Principais tecnologias:</p>
            <ul className="grid grid-cols-2 gap-2 font-mono text-sm">
              {[
                "JavaScript (ES6+)",
                "TypeScript",
                "React",
                "Node.js",
                "Tailwind CSS",
                "Next.js",
              ].map((tech) => (
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
        </section>

        {/* Experiência Section */}
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
            className="flex items-center text-2xl font-bold text-[#ccd6f6] mb-8"
          >
            <span className="text-[#64ffda] font-mono mr-2">03.</span>
            Alguns Projetos
          </motion.h2>
          <div className="space-y-12">
            <ExperienceCard
              company="Projeto Pessoal"
              role="E-commerce Dashboard"
              period="2023"
              description="Dashboard para gerenciamento de e-commerce com análise de dados em tempo real, gestão de produtos e relatórios personalizados."
              technologies={["React", "TypeScript", "Tailwind", "Chart.js"]}
            />
            <ExperienceCard
              company="Projeto Open Source"
              role="Task Management App"
              period="2022"
              description="Aplicativo de gerenciamento de tarefas com funcionalidades de drag-and-drop, filtros avançados e integração com calendário."
              technologies={["Next.js", "TypeScript", "Prisma", "PostgreSQL"]}
            />
          </div>
        </section>

        {/* Contato Section */}
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
                href="mailto:seu@email.com"
                className="flex items-center before:content-['▹'] before:text-[#64ffda] before:mr-2 hover:text-[#64ffda] transition-colors"
              >
                seu@email.com
              </motion.a>
              <motion.a
                href="https://github.com/seu-usuario"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center before:content-['▹'] before:text-[#64ffda] before:mr-2 hover:text-[#64ffda] transition-colors"
              >
                GitHub
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/seu-usuario"
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
