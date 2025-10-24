"use client";

import AboutSidebar from "@/components/ui/AboutSidebar";
import { ExpandableCardDemo } from "@/components/ui/certifications-carousel";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { FloatingDock } from "@/components/ui/floating-dock";
//import { HeroParallax } from "@/components/ui/hero-parallax";
import FeaturedProjects from "@/components/ui/hero-parallax";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import SkillsShowcase from "@/components/ui/skills-showcase";
import {
  IconHome,
  IconMail,
  IconBrandLinkedin,
  IconBrandGithub,
} from "@tabler/icons-react";

import CursorShowcase from "@/components/ui/CursorShowcase"; // 👈 new hero showcase
import ContactForm from "@/components/ui/ContactForn";

export default function Home() {
  const links = [
    {
      title: "Home",
      href: "/",
      icon: <IconHome className="w-full h-full text-neutral-600 dark:text-neutral-300" />,
    },
    {
      title: "Mail",
      href: "mailto:raunitraj06@gmail.com",
      icon: <IconMail className="w-full h-full text-neutral-600 dark:text-neutral-300" />,
    },
    {
      title: "LinkedIn",
      href: "https://www.linkedin.com/in/-raunit-raj",
      icon: <IconBrandLinkedin className="w-full h-full text-neutral-600 dark:text-neutral-300" />,
    },
    {
      title: "GitHub",
      href: "https://github.com/raunit45",
      icon: <IconBrandGithub className="w-full h-full text-neutral-600 dark:text-neutral-300" />,
    },
  ];

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative w-screen h-screen p-0 m-0">
        <CursorShowcase
          images={[
            { src: "/gallery/amazonclone.png", alt: "Amazon Clone Project" },
            { src: "/gallery/kleats.png", alt: "Kleats Platform" },
            { src: "/gallery/newsnow.png", alt: "NewsNow App" },
            { src: "/gallery/supermarket.png", alt: "Smart Supermarket Dashboard" },
          ]}
          title={
            <>
              Intelligent by <span className="italic text-indigo-400">Design</span> — engineered for interaction.
            </>
          }
          subtitle="I build immersive interfaces that feel alive — blending data, motion, and precision engineering to turn ideas into experiences."
          width={220}
        />

        {/* Download resume button (place the PDF in /public/Raunit_Raj_Resume.pdf) */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-12 z-40">
          <a
            href="/Raunit_Raj_Resume.pdf"
            download
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-lg transition"
            aria-label="Download resume"
          >
            Download Resume
          </a>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="relative">
        <ContainerScroll
          titleComponent={
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              About <span className="text-indigo-400">Me</span>
            </h2>
          }
        >
          <AboutSidebar />
          <AboutSidebar />
        </ContainerScroll>

        <SkillsShowcase />
        <FeaturedProjects />
        <ExpandableCardDemo />
        <ContactForm />
      </section>

      {/* ================= FLOATING DOCK ================= */}
      <FloatingDock
        items={links}
        desktopClassName="fixed bottom-10 left-1/2 -translate-x-1/2 z-50"
        mobileClassName="fixed bottom-5 right-5 z-50"
      />
    </>
  );
}
