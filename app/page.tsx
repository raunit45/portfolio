"use client";
import AboutSidebar from "@/components/ui/AboutSidebar";
import { ExpandableCardDemo } from "@/components/ui/certifications-carousel";
import ContactForm from "@/components/ui/ContactForm";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { FloatingDock } from "@/components/ui/floating-dock";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import SkillsShowcase from "@/components/ui/skills-showcase";
import {
  IconHome,
  IconMail,
  IconBrandLinkedin,
  IconBrandGithub,
} from "@tabler/icons-react";
export default function Home() {
  const links = [
    { title: "Home", href: "/", icon: <IconHome className="w-full h-full text-neutral-600 dark:text-neutral-300" /> },
    { title: "Mail", href: "mailto:raunitraj06@gmail.com", icon: <IconMail className="w-full h-full text-neutral-600 dark:text-neutral-300" /> },
    { title: "LinkedIn", href: "https://www.linkedin.com/in/-raunit-raj", icon: <IconBrandLinkedin className="w-full h-full text-neutral-600 dark:text-neutral-300" /> },
    { title: "GitHub", href: "https://github.com/raunit45", icon: <IconBrandGithub className="w-full h-full text-neutral-600 dark:text-neutral-300" /> },
  ];

  return (
    <>
      {/* Hero (BackgroundLines runs globally from layout.tsx) */}
      <section className="relative min-h-screen w-full flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight tracking-tight">
            Hi, I’m <span className="text-indigo-400">Raunit Raj</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-neutral-300 font-medium">
            Full-Stack Developer • DevOps Engineer • Cloud Enthusiast
          </p>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-neutral-400">
            I design and build modern, high-performance web apps — from pixel-perfect UIs to robust APIs and
            CI/CD pipelines. Comfortable with Next.js, TypeScript, Node.js, PostgreSQL, Docker, and AWS.
            Open to freelance and full-time roles.
          </p>

          <div className="pt-4 flex items-center justify-center gap-4">
            <a href="#projects" className="px-6 py-2.5 rounded-md bg-indigo-500 text-white text-sm sm:text-base font-medium hover:bg-indigo-600 transition shadow-md">
              View Projects
            </a>
            <a href="#contact" className="px-6 py-2.5 rounded-md border border-neutral-600 text-sm sm:text-base font-medium text-neutral-300 hover:bg-neutral-800 transition shadow-md">
              Contact Me
            </a>
          </div>
        </div>
      </section>

  {/* Scrolling words section */}
 

      {/* About Me (scroll-3D card) */}
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
  <HeroParallax />
  <ExpandableCardDemo />
  <ContactForm />
   
      </section>

      {/* Floating dock */}
      <FloatingDock
        items={links}
        desktopClassName="fixed bottom-10 left-1/2 -translate-x-1/2 z-50"
        mobileClassName="fixed bottom-5 right-5 z-50"
      />
    </>
  );
}
