"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconUser,
  IconSchool,
  IconHeart,
  IconStar,
  IconTimeline,
  IconChecks,
  IconPlayerPlayFilled,
  IconBallTennis,
  IconBrandSpotify,
  IconMovie,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type Tab = "about" | "study" | "hobbies" | "favourites" | "life";

const tabs: { key: Tab; label: string; icon: React.ComponentType<any> }[] = [
  { key: "about", label: "About Me", icon: IconUser },
  { key: "study", label: "Where do I study?", icon: IconSchool },
  { key: "hobbies", label: "Hobbies", icon: IconHeart },
  { key: "favourites", label: "Favourites", icon: IconStar },
  { key: "life", label: "Life till now", icon: IconTimeline },
];

export default function AboutSidebar() {
  const [active, setActive] = useState<Tab>("about");

  return (
    <div className="flex h-full w-full rounded-2xl overflow-hidden bg-neutral-950/60 ring-1 ring-white/10 backdrop-blur-sm">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-white/10 bg-neutral-950/40">
        <div className="px-4 py-3 text-sm uppercase tracking-wide text-neutral-400">
          Profile
        </div>

        <nav className="px-2 pb-3">
          {tabs.map(({ key, label, icon: Icon }) => {
            const selected = key === active;
            return (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                  "text-neutral-300 hover:bg-white/[0.04] hover:text-white",
                  selected && "bg-white/[0.06] text-white ring-1 ring-white/10"
                )}
              >
                <Icon
                  size={18}
                  className={cn(
                    "transition",
                    selected ? "text-indigo-400" : "text-neutral-400 group-hover:text-indigo-300"
                  )}
                />
                <span className="truncate">{label}</span>
                {selected && <span className="ml-auto h-2 w-2 rounded-full bg-indigo-400/80" />}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto hidden md:block p-3 text-[11px] text-neutral-500">
          <div className="rounded-md bg-neutral-900/60 p-3 ring-1 ring-white/5">
            <div className="mb-1 text-neutral-300">Raunit Raj</div>
            <div>Full-Stack • DevOps</div>
          </div>
        </div>
      </aside>

      {/* Content area */}
      <section className="relative flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="h-full overflow-y-auto"
          >
            {active === "about" && <AboutContent />}
            {active === "study" && <StudyContent />}
            {active === "hobbies" && <HobbiesContent />}
            {active === "favourites" && <FavouritesContent />}
            {active === "life" && <LifeContent />}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}

/* ---------------- Panels ---------------- */

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-5 md:p-40">
      <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">{title}</h3>
      <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-4 md:p-6 leading-relaxed text-neutral-300">
        {children}
      </div>
    </div>
  );
}

function AboutContent() {
  return (
    <Shell title="About Me">
      <p className="mb-3">
        I’m a full-stack developer focused on crafting fast, elegant and scalable web apps. I love
        bringing ideas to life end-to-end — from UX to APIs to CI/CD.
      </p>
      <p className="text-neutral-400">
        Tools I enjoy: <span className="text-neutral-300">Next.js, TypeScript, Node.js, PostgreSQL, Docker, AWS</span>.
        When I’m not shipping features, I’m experimenting with motion design and performance tuning.
      </p>
    </Shell>
  );
}

function StudyContent() {
  return (
    <Shell title="Where do I study?">
      <ul className="space-y-3">
        <li className="flex items-start gap-3">
          <span className="mt-1 inline-block h-2 w-2 rounded-full bg-indigo-400" />
          <div>
            <div className="font-medium text-white">Koneru Lakshmaiah University (KLU)</div>
            <div className="text-sm text-neutral-400">2023 — Present • GPA &gt; 9.5</div>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="mt-1 inline-block h-2 w-2 rounded-full bg-indigo-400" />
          <div>
            <div className="font-medium text-white">DAV, Patna</div>
            <div className="text-sm text-neutral-400">Class 12 • 86.20% • 2023</div>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="mt-1 inline-block h-2 w-2 rounded-full bg-indigo-400" />
          <div>
            <div className="font-medium text-white">Leeds Asian School, Patna</div>
            <div className="text-sm text-neutral-400">Class 10 • 92.17% • 2021</div>
          </div>
        </li>
      </ul>
    </Shell>
  );
}

/* HOBBIES */
function HobbiesContent() {
  const items = [
    { label: "Chess", icon: IconBallTennis }, // using a ball icon as a generic glyph
    { label: "Cricket", icon: IconBallTennis },
    { label: "Music", icon: IconBrandSpotify },
    { label: "Movies", icon: IconMovie },
    { label: "Mobile Gaming", icon: IconBallTennis },
    { label: "Naps", icon: IconBallTennis },
  ];

  return (
    <Shell title="Hobbies">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
      >
        {items.map(({ label, icon: Icon }) => (
          <motion.div
            key={label}
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -2, scale: 1.01 }}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-neutral-900/60 px-4 py-3"
          >
            <Icon size={18} className="text-indigo-400" />
            <span className="text-neutral-200">{label}</span>
          </motion.div>
        ))}
      </motion.div>
    </Shell>
  );
}

/* FAVOURITES: Movies (Netflix-ish), Songs (Spotify-ish), Anime (comic cards) */
function FavouritesContent() {
  const movies = [
    "Interstellar",
    "Tokyo Drift",
    "Raaz",
    "Once Upon a Time in Mumbaai Dobara",
    "Game of Thrones",
    "Breaking Bad",
    "Peaky Blinders",
    "Inception",
    "The Dark Knight",
  ];

  const songs = [
    "See You Again",
    "Shape of You",
    "Thunder",
    "Hall of Fame",
    "Tere Bina",
    "Dil Ibadat",
    "Jeena Jeena",
  ];

  const anime = ["Doraemon", "Shinchan", "Attack on Titan", "Death Note", "Naruto"];

  return (
    <div className="space-y-6">
      <Shell title="Movies (Netflix vibe)">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        >
          {movies.map((m) => (
            <motion.div
              key={m}
              variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -4, scale: 1.03 }}
              className="aspect-[2/3] rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900 ring-1 ring-white/10 shadow-md relative overflow-hidden"
            >
              {/* “poster” title */}
              <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                <div className="text-[12px] text-neutral-200 font-medium">{m}</div>
              </div>
              {/* subtle shine */}
              <div className="pointer-events-none absolute -left-8 top-0 h-full w-1/2 rotate-12 bg-white/5 blur-sm" />
            </motion.div>
          ))}
        </motion.div>
      </Shell>

      <Shell title="Songs (Spotify vibe)">
        <motion.ul
          className="space-y-2"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        >
          {songs.map((s, i) => (
            <motion.li
              key={s}
              variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.01 }}
              className="group flex items-center gap-3 rounded-lg bg-neutral-900/60 ring-1 ring-white/10 px-3 py-2"
            >
              <button className="grid place-items-center h-7 w-7 rounded-full bg-emerald-500/90 text-black transition group-hover:scale-110">
                <IconPlayerPlayFilled size={16} />
              </button>
              <div className="flex-1">
                <div className="text-neutral-200">{s}</div>
                <div className="text-[11px] text-neutral-500">Spotify • Popular</div>
              </div>
              <div className="text-[11px] text-neutral-500">0{i + 1}:3{i}</div>
            </motion.li>
          ))}
        </motion.ul>
      </Shell>

      <Shell title="Anime (comic cards)">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        >
          {anime.map((a) => (
            <motion.div
              key={a}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ rotate: -1.5, scale: 1.03 }}
              className={cn(
                "relative rounded-lg p-3 text-center font-medium text-neutral-100",
                "bg-neutral-900/70 ring-1 ring-white/10 shadow-[0_6px_0_#111]",
                "before:absolute before:inset-0 before:rounded-lg before:pointer-events-none",
                "before:bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,.06),transparent_40%)]"
              )}
            >
              {a}
              <div className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-indigo-500/90 shadow-md" />
            </motion.div>
          ))}
        </motion.div>
      </Shell>
    </div>
  );
}

/* LIFE TILL NOW (replaces Roadmap) */
function LifeContent() {
  const items = [
    { year: "Age 2", title: "Started school", detail: "Tiny kick-off to a long journey." },
    {
      year: "2021",
      title: "Class 10 • Leeds Asian School, Patna",
      detail:
        "92.17% • Awards: Most Disciplined (Class 7), House Captain, Class Ranker (3×).",
    },
    {
      year: "2023",
      title: "Class 12 • DAV, Patna",
      detail: "86.20% • Wrapped up school with great memories.",
    },
    {
      year: "2023 — Present",
      title: "Koneru Lakshmaiah University (KLU)",
      detail: "Maintaining GPA above 9.5 and building unforgettable memories.",
    },
  ];

  return (
    <Shell title="Life till now">
      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10" />
        <ul className="space-y-5">
          {items.map((it, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20% 0px" }}
              transition={{ duration: 0.25 }}
              className="relative pl-10"
            >
              <span className="absolute left-1 top-2 grid place-items-center h-4 w-4 rounded-full bg-indigo-500/90 ring-2 ring-neutral-900">
                <IconChecks size={12} className="text-white" />
              </span>
              <div className="text-xs text-neutral-400">{it.year}</div>
              <div className="font-medium text-white">{it.title}</div>
              <div className="text-neutral-300">{it.detail}</div>
            </motion.li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}
