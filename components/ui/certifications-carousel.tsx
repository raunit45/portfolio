"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SparklesCore } from "@/components/ui/sparkles";

export function ExpandableCardDemo() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  // Close on ESC
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = active && typeof active === "object" ? "hidden" : "auto";
  }, [active]);

  // Outside click (no custom hook)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setActive(null);
      }
    }
    if (active && typeof active === "object") {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [active]);

  return (
    <>
      {/* ===== Sparkling heading ===== */}
      <div className="w-full bg-black rounded-md overflow-hidden py-12 flex flex-col items-center justify-center">
        <h1 className="text-white font-bold text-center text-3xl md:text-6xl relative z-20">
          Certifications
        </h1>
        <div className="relative w-[28rem] md:w-[40rem] h-20 mt-3">
          {/* subtle gradient rails */}
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
          {/* sparkles */}
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
          {/* mask to soften edges */}
          <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]" />
        </div>
      </div>

      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-contain bg-neutral-100 dark:bg-neutral-800 p-4"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>

                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function" ? active.content() : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <ul className="max-w-2xl mx-auto w-full gap-4">
        {cards.map((card) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col md:flex-row ">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <img
                  width={100}
                  height={100}
                  src={card.src}
                  alt={card.title}
                  className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-contain bg-neutral-100 dark:bg-neutral-800 p-2"
                />
              </motion.div>
              <div>
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${card.title}-${id}`}
              className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0"
            >
              {card.ctaText}
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

/* ---------------- Certifications data ---------------- */

const cards = [
  {
    title: "Microsoft Azure Fundamentals (AZ-900)",
    description:
      "Cloud concepts, core Azure services, security, governance, pricing & lifecycle.",
    src: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg",
    ctaText: "Verify",
    ctaLink: "https://www.linkedin.com/", // ← replace with your credential URL
    content: () => (
      <p>
        Foundational cloud knowledge and familiarity with Azure services like
        Compute, Storage, Networking and identity basics. Great for cloud
        beginners and cross-functional roles.
      </p>
    ),
  },
  {
    title: "Microsoft Azure AI Fundamentals (AI-900)",
    description:
      "AI/ML fundamentals, responsible AI, and Azure AI services (Vision, NLP, Search).",
    src: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg",
    ctaText: "Verify",
    ctaLink: "https://www.linkedin.com/", // ← replace
    content: () => (
      <p>
        Core AI workloads, machine learning concepts, Cognitive Services, Azure
        OpenAI, and responsible AI considerations for real-world apps.
      </p>
    ),
  },
  {
    title: "Salesforce AI Associate",
    description:
      "GenAI basics in Salesforce: prompts, ethics, Data Cloud context & use-cases.",
    src: "https://upload.wikimedia.org/wikipedia/commons/3/32/Salesforce.com_logo.svg",
    ctaText: "Verify",
    ctaLink: "https://www.linkedin.com/", // ← replace
    content: () => (
      <p>
        Understanding AI capabilities within Salesforce, prompt patterns, and
        governance themes to deploy AI responsibly in CRM workflows.
      </p>
    ),
  },
  {
    title: "Postman API Fundamentals Student Expert",
    description:
      "Requests, collections, environments, testing, monitors & documentation.",
    src: "https://voyager.postman.com/logo/postman-logo-icon-orange.svg",
    ctaText: "Verify",
    ctaLink: "https://www.linkedin.com/", // ← replace
    content: () => (
      <p>
        Hands-on API lifecycle with Postman: design, test, automate, monitor,
        and publish docs; collaborate using environments and collections.
      </p>
    ),
  },
  {
    title: "Infosys Springboard Internship",
    description:
      "Applied engineering practices: code reviews, delivery discipline, industry exposure.",
    src: "https://upload.wikimedia.org/wikipedia/commons/4/40/Infosys_logo.svg",
    ctaText: "Verify",
    ctaLink: "https://www.linkedin.com/", // ← replace
    content: () => (
      <p>
        Practical internship experience focusing on teamwork, development
        workflows, and professional communication in a real project setting.
      </p>
    ),
  },
  {
    title: "NVIDIA Fundamentals of Deep Learning",
    description:
      "DL essentials, CNNs, transfer learning & GPU-accelerated training workflows.",
    src: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg",
    ctaText: "Verify",
    ctaLink: "https://www.linkedin.com/", // ← replace
    content: () => (
      <p>
        Building and training deep neural networks, leveraging GPUs, and using
        transfer learning for computer vision tasks efficiently.
      </p>
    ),
  },
];
