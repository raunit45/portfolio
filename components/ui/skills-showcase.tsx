"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/** 🔗 Link preview card */
function LinkPreview({ url, title }: { url: string; title?: string }) {
  const src = `https://api.microlink.io?url=${encodeURIComponent(
    url
  )}&screenshot=true&meta=false&embed=screenshot.url&overlay.browser=light`;

  return (
    <div className="relative w-80 rounded-xl overflow-hidden border border-neutral-800 bg-transparent shadow-2xl">
      {/* 👇 background made transparent */}
      <div className="relative h-44 w-full">
        <Image
          src={src}
          alt={title || url}
          fill
          sizes="320px"
          className="object-cover opacity-95"
        />
      </div>
      <div className="p-3 bg-neutral-900/40 backdrop-blur-0">
        <div className="text-sm font-medium text-neutral-100 truncate">
          {title || url.replace(/^https?:\/\//, "")}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-neutral-400 truncate max-w-[65%]">
            {url.replace(/^https?:\/\//, "")}
          </span>
          <button
            onClick={() => window.open(url, "_blank")}
            className="px-2 py-1 text-xs rounded-md bg-indigo-500/90 hover:bg-indigo-500 text-white transition"
          >
            Open
          </button>
        </div>
      </div>
    </div>
  );
}

/** 🌐 Projects */
const KLEATS = { url: "https://kleats.in", title: "Kleats — Campus Pre-Ordering" };
const NEWSNOW = {
  url: "https://github.com/raunit45/newsnow",
  title: "NewsNow — Next.js + TS + CI/CD",
};
const GROCER = {
  url: "https://github.com/amalsalilan/GrocerGenius_AI_Based_Supermarket_Sales_Prediction_Infosys_Internship_Oct2024/tree/Raunit",
  title: "GrocerGenius — Python + ML (Infosys)",
};

/** 🧠 Skills */
const skills = [
  { icon: "💻", color: "text-sky-400", name: "C Language", project: NEWSNOW },
  { icon: "☕️", color: "text-amber-500", name: "Java", project: NEWSNOW },
  { icon: "🐍", color: "text-green-400", name: "Python", project: GROCER },
  { icon: "✨", color: "text-yellow-400", name: "JavaScript", project: NEWSNOW },
  { icon: "🌀", color: "text-sky-400", name: "TypeScript", project: NEWSNOW },
  { icon: "⚛️", color: "text-blue-400", name: "React", project: KLEATS },
  { icon: "🧩", color: "text-emerald-400", name: "Node.js", project: KLEATS },
  { icon: "🌿", color: "text-green-400", name: "Spring Boot", project: NEWSNOW },
  { icon: "🧮", color: "text-indigo-400", name: "Data Structures & Algorithms", project: NEWSNOW },
  { icon: "⚡", color: "text-yellow-400", name: "Vite", project: NEWSNOW },
  { icon: "📓", color: "text-orange-400", name: "Jupyter Notebook", project: GROCER },
  { icon: "🐼", color: "text-gray-300", name: "Pandas", project: GROCER },
  { icon: "🤖", color: "text-pink-400", name: "AI Tools", project: GROCER },
];

/** ⚙️ Tools */
const tools = [
  { icon: "🔀", color: "text-orange-400", name: "GitHub", project: NEWSNOW },
  { icon: "🐳", color: "text-sky-400", name: "Docker", project: NEWSNOW },
  { icon: "☁️", color: "text-yellow-400", name: "AWS", project: NEWSNOW },
  { icon: "🗄️", color: "text-green-500", name: "MongoDB", project: KLEATS },
  { icon: "🧮", color: "text-yellow-500", name: "MySQL", project: KLEATS },
  { icon: "🚀", color: "text-gray-300", name: "Postman", project: KLEATS },
  { icon: "🎨", color: "text-pink-400", name: "Figma", project: KLEATS },
  { icon: "🖊️", color: "text-purple-400", name: "Penpot", project: KLEATS },
  { icon: "🐧", color: "text-gray-400", name: "Linux", project: KLEATS },
];

const MotionDiv = motion.div;

/** 🧱 Main Component */
export default function SkillsTools() {
  return (
    <section
      id="skills"
      className="relative py-20 text-white bg-transparent"
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Header */}
        <h2 className="text-3xl md:text-5xl font-extrabold mb-12 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">
            Skills
          </span>{" "}
          &{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Tools
          </span>
        </h2>

        {/* Skills */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="mb-6 text-lg text-neutral-400 font-medium"
        >
          • Skills •
        </motion.h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-10 mb-20">
          {skills.map((skill) => (
            <Link key={skill.name} href={skill.project.url} target="_blank" className="group relative">
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{
                  scale: 1.1,
                  y: -6,
                  transition: { type: "spring", stiffness: 300, damping: 18 },
                }}
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <div
                  className={`relative flex items-center justify-center rounded-2xl p-5 bg-neutral-900/40 border border-neutral-800 group-hover:border-indigo-500/50 shadow-lg transition-all`}
                >
                  <div className={`w-8 h-8 ${skill.color} text-2xl`}>{skill.icon}</div>
                  <motion.div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/0 to-sky-500/0 opacity-0 group-hover:opacity-20 transition-all" />
                </div>
                <p className="text-sm md:text-base text-neutral-300 group-hover:text-white transition-all">
                  {skill.name}
                </p>
              </MotionDiv>

              {/* Hover preview */}
              <div className="pointer-events-none absolute left-1/2 top-[110%] z-30 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition">
                <LinkPreview url={skill.project.url} title={skill.project.title} />
              </div>
            </Link>
          ))}
        </div>

        {/* Tools */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="mb-6 text-lg text-neutral-400 font-medium"
        >
          • Tools & Technologies •
        </motion.h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-10">
          {tools.map((tool) => (
            <Link key={tool.name} href={tool.project.url} target="_blank" className="group relative">
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{
                  scale: 1.1,
                  y: -6,
                  transition: { type: "spring", stiffness: 300, damping: 18 },
                }}
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <div
                  className={`relative flex items-center justify-center rounded-2xl p-5 bg-neutral-900/40 border border-neutral-800 group-hover:border-pink-500/50 shadow-lg transition-all`}
                >
                  <div className={`w-8 h-8 ${tool.color} text-2xl`}>{tool.icon}</div>
                  <motion.div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/0 to-purple-500/0 opacity-0 group-hover:opacity-20 transition-all" />
                </div>
                <p className="text-sm md:text-base text-neutral-300 group-hover:text-white transition-all">
                  {tool.name}
                </p>
              </MotionDiv>

              {/* Hover preview */}
              <div className="pointer-events-none absolute left-1/2 top-[110%] z-30 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition">
                <LinkPreview url={tool.project.url} title={tool.project.title} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
