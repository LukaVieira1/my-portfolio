# Changelog

## v1.1.0 (2025-01-09)

### 🎨 UI/UX

- Remove push interaction from particles background

## v1.0.0 (2025-01-08)

### 🎨 Theme System

- Implemented light/dark theme system
- Added ThemeContext for theme management
- Created ThemeToggle component
- Added theme persistence in localStorage
- Updated color system with CSS variables
- Adapted ParticlesBackground to support both themes
- Updated all components to use current theme colors

### 🏗 Structure

- Reorganized file structure
- Created data folder with separate files for:
  - experiences.ts
  - navigation.ts
  - projects.ts
  - skills.ts
- Added index.ts file to centralize exports
- Improved data typing
- Optimized imports

### 🎨 UI/UX

- Added smooth theme transitions
- Improved language switch animations
- Optimized animation performance
- Adjusted contrast and readability in both themes

### 📦 Dependencies

- Updated Tailwind v3 to v4 beta

### 💅 Refinements

- Improved code organization
- Added explanatory comments
- Optimized code reusability
- Standardized code style
- Enhanced documentation

## v0.2.1 (2025-01-08)

### 🐛 Bug Fixes

- Fixed the navigation to the contact section

## v0.2.0 (2025-01-08)

### 🌐 Internationalization

- Added i18n support for multiple languages
- Implemented language switcher component
- Added translations for:
  - English (en-US)
  - Portuguese (pt-BR)
- Created translation files for all static content
- Added language persistence in localStorage

### 🏗 Components

- `LanguageSwitcher`: Toggle between available languages
- Updated all components to support i18n

### 📦 Dependencies

- Added i18next for internationalization
- Added react-i18next for React integration

## v0.1.0 (2025-01-07)

### 🎨 UI/UX

- Implemented modern design with dark theme
- Added custom favicon and title
- Created interactive particle background effect
- Implemented project carousel with autoplay
- Developed vertical timeline for experiences
- Added minimalist toggle switch for project filtering

### 🏗 Components

- `ParticlesBackground`: Interactive particle system background
- `ProjectCard`: Card for project display
- `ProjectCarousel`: Carousel with project preview
- `ExperienceCard`: Card for experience display
- `ExperienceTimeline`: Vertical timeline for professional history
- `SkillCard`: Card for technical skills display

### 🛠 Features

- Smooth section navigation system
- Framer Motion animations
- Particle interactivity with mouse hover
- Project preview in carousel
- Filter between personal and professional projects
- Responsive layout for all resolutions

### 📚 Documentation

- Created comprehensive README with:
  - Project description
  - Feature list
  - Tech stack
  - Installation instructions
  - Project structure
  - Customization guide

### 📦 Dependencies

- Added Framer Motion for animations
- Added React Icons for iconography
- Implemented React Particles for interactive background
- Configured TailwindCSS for styling

### 💅 Refinements

- Refactored About Me text
- Enhanced header text
- Updated experience content
- Optimized project descriptions
- Adjusted card and image sizes
