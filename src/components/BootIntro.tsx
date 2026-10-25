import { useEffect, useRef, useState } from "react";

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
  const doneRef = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      onDone();
    };

    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        finish();
        return;
      }
    } catch {
      finish();
      return;
    }

    const step = window.setInterval(() => {
      setShown((n) => Math.min(n + 1, LINES.length));
    }, 280);
    const done = window.setTimeout(finish, 1500);
    const safety = window.setTimeout(finish, 2200);
    return () => {
      window.clearInterval(step);
      window.clearTimeout(done);
      window.clearTimeout(safety);
    };
  }, [onDone]);

  return (
    <button
      type="button"
      onClick={() => {
        doneRef.current = true;
        onDone();
      }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#04070c]/95 px-6 text-left"
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
