import type { IProject } from "../types";
import { assert } from "./assert";

/** Stacks principais da narrativa de projetos. */
export const CORE_STACKS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
] as const;

export type CoreStack = (typeof CORE_STACKS)[number];

function hasExactTech(technologies: string[], name: string): boolean {
  return technologies.includes(name);
}

/**
 * Entra na narrativa se usa React, Next.js ou Node.js.
 * TypeScript sozinho (ex.: Vue+TS) não basta.
 */
export function isCoreStackProject(project: IProject): boolean {
  assert(project.technologies.length > 0, `project "${project.title}" has no techs`);
  return (
    hasExactTech(project.technologies, "React") ||
    hasExactTech(project.technologies, "Next.js") ||
    hasExactTech(project.technologies, "Node.js")
  );
}

/** Só exibe as stacks principais presentes no projeto. */
export function coreStacksOf(project: IProject): CoreStack[] {
  return CORE_STACKS.filter((stack) =>
    hasExactTech(project.technologies, stack),
  );
}

export function filterCoreStackProjects(projects: IProject[]): IProject[] {
  const filtered = projects.filter(isCoreStackProject);
  assert(
    filtered.length > 0,
    "nenhum projeto com React/Next.js/Node.js na narrativa",
  );
  return filtered;
}
