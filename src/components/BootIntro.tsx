import { useEffect, useState } from "react";

const LINES = [
  "> init luka-vieira.dev",
  "> load profile · 8y IT · 5y software",
  "> mount stack · react next typescript node",
  "> signal ready",
];

interface BootIntroProps {
  onDone: () => void;
}

export function BootIntro({ onDone }: BootIntroProps) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      onDone();
      return;
    }
    const step = window.setInterval(() => {
      setShown((n) => {
        if (n >= LINES.length) {
          window.clearInterval(step);
          return n;
        }
        return n + 1;
      });
    }, 280);
    const done = window.setTimeout(onDone, 1500);
    return () => {
      window.clearInterval(step);
      window.clearTimeout(done);
    };
  }, [onDone]);

  return (
    <button
      type="button"
      onClick={onDone}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#04070c] px-6 text-left"
    >
      <div className="w-full max-w-md font-mono text-[13px] leading-7 text-primary md:text-base">
        {LINES.slice(0, shown).map((line) => (
          <p key={line} className="mb-1">
            {line}
          </p>
        ))}
        <p className="animate-pulse">█</p>
        <p className="mt-10 text-[11px] text-text-secondary">tap to skip</p>
      </div>
    </button>
  );
}
