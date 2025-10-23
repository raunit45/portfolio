// lib/resume.ts
export type ResumeSectionKey =
  | "Objective"
  | "Education"
  | "Experience"
  | "Skills"
  | "Projects"
  | "Achievements";

export type SectionInfo = {
  key: ResumeSectionKey;
  color: string;       // UI tint
  lines: string[];     // tooltip lines in the HUD
  open?: string;       // internal page or external link
};

// Sections/links summarized from your PDF resume (Objective, Education, Experience,
// Skills, Projects / Open-Source, Achievements & Highlights). Keep these concise.
export const SECTIONS: SectionInfo[] = [
  {
    key: "Objective",
    color: "#60a5fa",
    lines: [
      "CS undergrad • SWE + SQL + Python",
      "Full-stack dev • Agile/Scrum",
      "Seeking impactful SWE roles",
    ],
    open: "/about",
  },
  {
    key: "Education",
    color: "#a78bfa",
    lines: [
      "B.Tech CSE — K L E F University",
      "CGPA: 9.54/10",
      "Core: DSA, DBMS, ML",
    ],
    open: "/about",
  },
  {
    key: "Experience",
    color: "#f59e0b",
    lines: [
      "Infosys Springboard — Data Science Intern",
      "Agile sprints • Analysis • ML validation",
    ],
    open: "https://www.linkedin.com/in/raunitraj",
  },
  {
    key: "Skills",
    color: "#22c55e",
    lines: [
      "Java, C, JS/TS, Python, SQL",
      "React/Next, Spring Boot, Firebase",
      "Docker, Jenkins, Azure, Mongo/MySQL",
    ],
    open: "/skills",
  },
  {
    key: "Projects",
    color: "#ef4444",
    lines: [
      "NewsNow — Next+TS+CI/CD",
      "KL Eats — Realtime orders",
      "Supermarket Sales — ML",
    ],
    open: "/projects",
  },
  {
    key: "Achievements",
    color: "#06b6d4",
    lines: [
      "AZ-900 + Azure AI Fundamentals",
      "Postman API Specialist",
      "CGPA 9.54/10",
    ],
    open: "/about",
  },
];

// Game tuning
export const GAME = {
  worldWidth: 1200,      // playfield width (px)
  worldHeight: 700,      // playfield height (px)
  spawnDelayMs: 1600,    // time between drops
  fallSpeedMin: 140,     // px/s
  fallSpeedMax: 260,     // px/s
  catchRadius: 50,       // collision radius
};

// NOTE: PDF lives at /public/resume.pdf so the unlock dialog can show it.
export const RESUME_PDF_PATH = "/resume.pdf";
