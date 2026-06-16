export interface IExperience {
  company: string;
  role: string;
  period: string;
  description: string[];
  technologies: string[];
  link?: string;
}

export interface IProject {
  title: string;
  description: string[];
  technologies: string[];
  link?: string;
  isPersonal: boolean;
  githubLink?: string;
  image?: string;
}

export interface INavItem {
  name: string;
  id: string;
}
