import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useLenis } from "./hooks/useLenis";
import { SettingsMenu } from "./components/SettingsMenu";
import { BootIntro } from "./components/BootIntro";
import { ImmersiveHero } from "./components/ImmersiveHero";
import { AboutReveal } from "./components/AboutReveal";
import { ExperienceCinematic } from "./components/ExperienceCinematic";
import { ProjectGallery } from "./components/ProjectGallery";
import { ContactClose } from "./components/ContactClose";
import { CursorTrail } from "./components/CursorTrail";
import { getExperiences, getProjects } from "./data";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const { t, i18n } = useTranslation();
  const [booting, setBooting] = useState(true);
  const dismissBoot = useCallback(() => setBooting(false), []);

  useLenis();

  useEffect(() => {
    if (booting) return;
    document.documentElement.style.setProperty("--scene", "var(--scene-hero)");
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 240);
    return () => window.clearTimeout(id);
  }, [booting, i18n.language]);

  useEffect(() => {
    if (booting) return;
    const scenes = ["about", "experience", "projects", "contact"] as const;
    const triggers = scenes.map((id) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top 58%",
        onEnter: () => {
          document.documentElement.style.setProperty("--scene", `var(--scene-${id})`);
        },
        onEnterBack: () => {
          document.documentElement.style.setProperty("--scene", `var(--scene-${id})`);
        },
      }),
    );
    return () => triggers.forEach((st) => st.kill());
  }, [booting]);

  return (
    <div className="relative min-h-screen max-w-[100vw] overflow-x-clip text-text-secondary">
      <Progress />
      <CursorTrail />
      {booting && <BootIntro onDone={dismissBoot} />}
      {!booting && (
        <main key={i18n.language} className="min-w-0">
          <ImmersiveHero
            name={t("hero.name")}
            description={t("hero.description")}
            mark={t("header.logo")}
          />
          <AboutReveal
            paragraphs={[t("about.paragraphs.0"), t("about.paragraphs.1")]}
            techsLabel={t("about.mainTechs")}
            yearsIt={t("about.yearsIt")}
            yearsDev={t("about.yearsDev")}
          />
          <ExperienceCinematic experiences={getExperiences(t)} />
          <ProjectGallery
            projects={getProjects(t)}
            professionalLabel={t("projects.filters.professional")}
            personalLabel={t("projects.filters.personal")}
          />
          <ContactClose title={t("contact.title")} description={t("contact.description")} />
        </main>
      )}
      <SettingsMenu />
    </div>
  );
}

function Progress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      node.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    update();
    gsap.ticker.add(update);
    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-[60] h-[2px] w-full origin-left scale-x-0 bg-primary"
    />
  );
}

export default App;
