import { assert } from "./assert";

type Listener = (progress: number) => void;

let progress = 0;
const listeners = new Set<Listener>();

export function setScrollProgress(next: number): void {
  assert(
    Number.isFinite(next),
    `scroll progress must be finite, got ${String(next)}`,
  );
  const clamped = Math.min(1, Math.max(0, next));
  progress = clamped;
  listeners.forEach((listener) => listener(progress));
}

export function getScrollProgress(): number {
  return progress;
}

export function subscribeScrollProgress(listener: Listener): () => void {
  assert(typeof listener === "function", "listener must be a function");
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
