import { assert } from "../lib/assert";

/** Ghost / double lettering no espírito editorial (designedbyruss). */
export function GhostType({
  text,
  as: Tag = "span",
  className = "",
}: {
  text: string;
  as?: "span" | "h1" | "h2" | "p";
  className?: string;
}) {
  assert(text.length > 0, "GhostType needs text");

  return (
    <Tag className={`relative inline-block ${className}`}>
      <span
        className="pointer-events-none absolute inset-0 translate-x-[0.07em] translate-y-[0.045em] select-none text-primary/30"
        aria-hidden
      >
        {text}
      </span>
      <span className="relative">{text}</span>
    </Tag>
  );
}

/** Cada glifo com sombra tipográfica (efeito “R R u u s s”). */
export function GhostLetters({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  assert(text.length > 0, "GhostLetters needs text");
  const chars = Array.from(text);

  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {chars.map((char, i) => (
        <span key={`${char}-${i}`} className="relative inline-block">
          <span
            className="pointer-events-none absolute left-[0.09em] top-[0.05em] select-none text-primary/25"
            aria-hidden
          >
            {char === " " ? "\u00A0" : char}
          </span>
          <span className="relative">{char === " " ? "\u00A0" : char}</span>
        </span>
      ))}
    </span>
  );
}
