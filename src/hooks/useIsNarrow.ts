import { useEffect, useState } from "react";
import { assert } from "../lib/assert";

/** Viewport estreito (mobile). Falha se matchMedia não existir. */
export function useIsNarrow(breakpointPx = 768): boolean {
  const [narrow, setNarrow] = useState(() => {
    assert(
      typeof window !== "undefined" && typeof window.matchMedia === "function",
      "matchMedia unavailable",
    );
    return window.matchMedia(`(max-width: ${breakpointPx - 1}px)`).matches;
  });

  useEffect(() => {
    assert(typeof window.matchMedia === "function", "matchMedia unavailable");
    const mq = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const onChange = () => setNarrow(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [breakpointPx]);

  return narrow;
}
