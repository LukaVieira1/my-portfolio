import { motion } from "framer-motion";
import { useScrollToSection } from "./hooks/useScrollToSection";
import { ParticlesBackground } from "./components/ParticlesBackground";
import { useState } from "react";
import { ExperienceTimeline } from "./components/ExperienceTimeline";
import { ProjectCarousel } from "./components/ProjectCarousel";

function App() {
  const scrollToSection = useScrollToSection();
  const [projectType, setProjectType] = useState<"professional" | "personal">(
    "professional"
  );

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

  const experiences = [
    {
      company: "GetHub",
      role: "Frontend Developer",
      period: "Mar 2023 - Presente",
      description: [
        "Na GetHub, atuo como Frontend Developer, onde sou responsável pelo desenvolvimento e manutenção de funcionalidades em Next.js, sempre com foco em performance e usabilidade. A GetHub é uma plataforma inovadora que conecta o ERP Millenium a grandes marketplaces, como Mercado Livre, Shopee, Amazon, Shein e Magalu, facilitando a integração e a gestão de vendas em múltiplos canais.",
        "Minhas responsabilidades incluem a criação e execução de testes end-to-end (E2E) utilizando Cypress, garantindo a qualidade do código e a confiabilidade das funcionalidades implementadas. Participo ativamente de decisões estratégicas de produto, ajudando a definir regras de negócio que impactam diretamente a experiência do usuário.",
        "Além disso, sou responsável pela elaboração e manutenção de documentação técnica, assegurando clareza e alinhamento entre as equipes. Realizo a análise de requisitos e viabilidade técnica para novas funcionalidades, colaborando de perto com Product Owners para garantir que as soluções atendam às necessidades do negócio.",
        "Identifico e resolvo bugs, incluindo suporte em código legado, como Ruby, e também ofereço treinamento e suporte a novos membros da equipe, promovendo integração e produtividade. Conduzo calls com stakeholders e clientes, apresentando progresso e insights do projeto, além de fornecer suporte direto ao cliente, oferecendo soluções ágeis para problemas identificados.",
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
      company: "Be Talent",
      role: "Frontend Developer",
      period: "Mar 2022 - Jan 2023",
      link: "https://bemobile.tech",
      description: [
        "Na Be Talent, anteriormente conhecida como Be Mobile, atuei como Frontend Developer em diversos projetos, contribuindo para o desenvolvimento de soluções inovadoras e eficientes.",
        "Fui responsável pelo desenvolvimento e manutenção de funcionalidades em jQuery, assegurando a performance e a funcionalidade de aplicações legadas, além de criar e otimizar recursos utilizando Nuxt.js, com foco em escalabilidade e experiência do usuário.",
        "Minha atuação incluiu a implementação e manutenção de componentes modernos em React.js, priorizando a criação de código limpo e reutilizável, o que resultou em uma base de código mais sustentável e de fácil manutenção.",
        "Trabalhei em colaboração com equipes multidisciplinares, participando ativamente de reuniões de planejamento e revisão, o que me permitiu alinhar as expectativas do cliente com as soluções técnicas propostas.",
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
      company: "Aggrandize",
      link: "https://aggrandize.com.br/",
      role: "A. de Suporte Jr.",
      period: "Mar 2021 - Mar 2022",
      description: [
        "Na Aggrandize, atuei como Analista de Suporte Junior, onde fui responsável por fornecer suporte técnico de alta qualidade aos clientes, garantindo soluções rápidas e eficazes para problemas técnicos e operacionais.",
        "Realizei a manutenção e monitoramento de recursos na Oracle Cloud Infrastructure (OCI), assegurando desempenho ideal e alta disponibilidade dos serviços, o que foi crucial para a continuidade das operações.",
        "Além disso, identifiquei e resolvi pequenos problemas no banco de dados, realizando análises e ajustes que melhoraram a funcionalidade e a eficiência das operações, contribuindo para uma experiência mais fluida para os usuários.",
        "Minha atuação proativa e habilidades de comunicação permitiram uma colaboração eficaz com as equipes internas, promovendo um ambiente de trabalho mais integrado e produtivo.",
      ],
      technologies: [
        "Oracle Cloud Infrastructure (OCI)",
        "Linux",
        "SQL",
        "Suporte Técnico",
      ],
    },
    {
      company: "Câmara Municipal de Vereadores de Canguçu",
      link: "https://www.camaracangucu.rs.gov.br/",
      role: "Estagiário em Informática",
      period: "Jul 2018 - Jun 2020",
      description: [
        "Durante meu estágio na Câmara Municipal de Vereadores de Canguçu, atuei como Estagiário em Informática, onde desenvolvi habilidades práticas em suporte técnico e manutenção de sistemas.",
        "Realizei assistência técnica em hardware, diagnosticando e realizando a manutenção de equipamentos para garantir seu funcionamento adequado.",
        "Ofereci suporte em software, incluindo instalação, configuração e resolução de problemas em sistemas operacionais e aplicativos, contribuindo para a eficiência das operações diárias.",
        "Além disso, apoiei na manutenção e configuração de redes, assegurando conectividade e funcionalidade para todos os usuários, o que foi fundamental para o bom andamento das atividades da instituição.",
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
      title: "GetHub",
      description: [
        "Dashboard para visualização de pedidos, estoques, anúncios e problemas pendentes.",
        "Alteração de preços de produtos para anúncios e sugestões de resolução de problemas.",
        "Integração contínua com o ERP Millenium, garantindo que o estoque e os preços estejam sempre atualizados, além da integração com a Nota Fiscal Eletrônica.",
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
      title: "MeuPass",
      description: [
        "Aplicativo PWA em desenvolvimento, que oferece um sistema completo de cardápio, gerenciamento de pedidos, pagamentos, login e cadastro.",
        "Com um design inovador e intuitivo, prioriza a usabilidade e a experiência do usuário.",
        "Você pode conferir mais no instagram do MeuPass @meupassbr",
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
      title: "Souplenus",
      description: [
        "Plataforma dedicada a conectar profissionais da área de psicologia com usuários, além de facilitar parcerias com empresas e disponibilizar locais para sessões de psicoterapia.",
        "Utilizada por profissionais da psicologia para promover seus serviços e facilitar o contato com potenciais clientes.",
        "Oferece diversos filtros para ajudar na busca pelo profissional ideal, além de um sistema de avaliações e comentários, e um recurso para agendamento de consultas.",
      ],
      technologies: ["Nuxt.js", "Tailwind", "React Query"],
      link: "https://www.souplenus.com.br/",
      isPersonal: false,
      image: "/projects/souplenus.png",
    },
    {
      title: "Awari",
      description: [
        "Plataforma de educação online com cursos e mentorias em tecnologia, focada em preparar alunos para o mercado de trabalho.",
        "Oferece uma variedade de cursos, desde programação básica até desenvolvimento fullstack, com foco em prática e aplicação dos conhecimentos.",
        "Além de mentorias, oferece acesso a uma comunidade de alunos e profissionais, para troca de conhecimentos e networking.",
        "Também conta com um dashboard para acompanhamento de projetos e alunos, com relatórios e métricas.",
      ],
      technologies: ["JQuery", "Laravel", "PHP", "React", "TypeScript"],
      link: "https://awari.com.br/",
      isPersonal: false,
      image: "/projects/awari.png",
    },
    {
      title: "Sistema de gestão (ERP) - MPI Informatica",
      description: [
        "O Sistema de Gestão (ERP) da MPI Informática é uma solução completa para automatizar operações, eliminando a necessidade de múltiplos sistemas. Com controle de estoque, fluxo de caixa, emissão de notas fiscais e relatórios detalhados, oferece uma visão clara do negócio.",
        "Funcionalidades incluem: Gestão de Vendas e Compras, Controle de Estoque, Relatórios Financeiros, Integração com gateways de pagamento e um ponto de venda (PDV) para atendimento ao cliente.",
      ],
      technologies: ["Vue 3", "Tailwind", "TypeScript", "Axios"],
      link: "https://mpiinformatica.com/sistema-de-gestao/",
      isPersonal: false,
      image: "/projects/mpi.jpeg",
    },
    {
      title: "Atlas Governance",
      description: [
        "Breve participação inicial da criação do dashboard da Atlas Governance, uma plataforma de governança corporativa. O dashboard permite a criação e convocação de reuniões, além de gerenciar os membros da organização.",
        "Documentos, relatórios e atas são gerados automaticamente, facilitando a gestão de ações e projetos estratégicos. A plataforma também oferece indexação e busca com inteligência artificial, além de avaliações de conselhos e comitês.",
      ],
      technologies: ["React", "Tailwind", "TypeScript", "Axios", "Redux"],
      link: "https://welcome.atlasgov.com/",
      isPersonal: false,
      image: "/projects/atlas.jpeg",
    },
    {
      title: "Tetris",
      description: [
        "Um classico dos anos 80! ",
        "O jogo conta com um sistema de pontuação e progressão de níveis, além de um ranking das melhores pontuações alcançadas e as próximas peças que serão geradas.",
        "Apresenta um design moderno com animações fluidas e suporte a múltiplos idiomas, incluindo português e inglês.",
        "Inclui um menu com opções para configuração de idioma e um tutorial interativo e a opção de pausar o jogo.",
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
      title: "Petwiiter",
      description: [
        "Um clonedo do X (Twitter) voltado para amantes de pets!",
        "Foi um dos meus primeiros projetos, onde aprendi muito sobre React e APIs (que também foi feita por mim).",
        "O Petwiiter é uma plataforma social onde você pode compartilhar textos e interagir com outros usuários.",
        "Inclui um sistema de login, comentários e perfis de usuários.",
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
    <div className="min-h-screen bg-[#0a192f] text-[#8892b0] relative">
      <ParticlesBackground />
      <div className="relative z-1">
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
              Apaixonado por resolver problemas e criar experiências digitais
              excepcionais.
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
            <ExperienceTimeline experiences={experiences} />
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

            {/* Toggle de Projetos */}
            <div className="flex justify-center mb-12">
              <div className="flex p-1 gap-1 bg-[#112240] rounded-lg">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProjectType("professional")}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    projectType === "professional"
                      ? "bg-[#64ffda] text-[#0a192f]"
                      : "text-[#8892b0] hover:text-[#ccd6f6]"
                  }`}
                >
                  Profissionais
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProjectType("personal")}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    projectType === "personal"
                      ? "bg-[#64ffda] text-[#0a192f]"
                      : "text-[#8892b0] hover:text-[#ccd6f6]"
                  }`}
                >
                  Pessoais
                </motion.button>
              </div>
            </div>

            <ProjectCarousel projects={filteredProjects} key={projectType} />
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
                Estou sempre aberto a novas oportunidades. Se você tem um
                projeto interessante ou só quer bater um papo, me manda uma
                mensagem!
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
    </div>
  );
}

export default App;
