import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { navItems } from "../data";

export function SiteNav() {
  const { t, i18n } = useTranslation();
  const items = navItems(t);
  const [active, setActive] = useState(items[0]?.id ?? "about");
  const bar = useRef<HTMLSpanElement>(null);
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const ids = items.map((item) => item.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.1, 0.25, 0.5] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [i18n.language]);

  useEffect(() => {
    const listEl = list.current;
    const barEl = bar.current;
    if (!listEl || !barEl) return;
    const current = listEl.querySelector<HTMLElement>(`[data-nav="${active}"]`);
    if (!current) return;
    barEl.style.width = `${current.offsetWidth}px`;
    barEl.style.transform = `translate3d(${current.offsetLeft}px,0,0)`;
  }, [active]);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="pointer-events-none fixed left-0 right-0 top-0 z-[55] px-4 pt-4 md:px-8">
      <div className="pointer-events-auto mx-auto flex max-w-[2200px] items-center justify-between gap-4">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-primary"
        >
          {t("header.logo")}
        </a>
        <nav aria-label="Primary">
          <ul ref={list} className="relative hidden items-center gap-6 md:flex">
            <span
              ref={bar}
              className="absolute bottom-0 left-0 h-px bg-primary transition-transform duration-300 ease-out"
            />
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  data-nav={item.id}
                  onClick={() => go(item.id)}
                  className={`pb-1 font-mono text-[11px] uppercase tracking-[0.16em] ${
                    active === item.id ? "text-text-primary" : "text-text-secondary"
                  }`}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
