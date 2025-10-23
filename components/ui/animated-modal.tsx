"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandInstagram,
} from "@tabler/icons-react";

interface ModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <ModalContext.Provider value={{ open, setOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};

export function Modal({ children }: { children: ReactNode }) {
  return <ModalProvider>{children}</ModalProvider>;
}

export const ModalTrigger = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { setOpen } = useModal();
  return (
    <button
      className={cn(
        "px-6 py-3 rounded-full text-white bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 font-semibold shadow-none hover:scale-105 transition-transform duration-300",
        className
      )}
      onClick={() => setOpen(true)}
    >
      {children}
    </button>
  );
};

export const ModalBody = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { open } = useModal();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { setOpen } = useModal();
  useOutsideClick(modalRef, () => setOpen(false));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <Overlay />
          <motion.div
            ref={modalRef}
            className={cn(
              "relative bg-neutral-950/70 backdrop-blur-xl border border-neutral-800 rounded-2xl text-white max-w-md w-[90%] mx-auto p-8 shadow-none",
              className
            )}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
          >
            <CloseIcon />
            <h2 className="text-2xl font-bold text-center mb-4">
              Let’s Connect 💬
            </h2>
            <p className="text-neutral-400 text-center mb-6">
              Reach out or follow me on these platforms:
            </p>

            <div className="flex flex-col gap-4">
              <SocialLink
                href="https://www.linkedin.com/in/-raunit-raj"
                icon={<IconBrandLinkedin className="text-sky-400 w-6 h-6" />}
                label="LinkedIn"
                username="@-raunit-raj"
              />
              <SocialLink
                href="https://github.com/raunit45"
                icon={<IconBrandGithub className="text-neutral-300 w-6 h-6" />}
                label="GitHub"
                username="@raunit45"
              />
              <SocialLink
                href="https://x.com/_raunitraj"
                icon={<IconBrandTwitter className="text-sky-400 w-6 h-6" />}
                label="Twitter (X)"
                username="@_raunitraj"
              />
              <SocialLink
                href="https://instagram.com/_raunitraj"
                icon={<IconBrandInstagram className="text-pink-500 w-6 h-6" />}
                label="Instagram"
                username="@_raunitraj"
              />
            </div>

            <div className="text-center mt-6">
              <a
                href="mailto:raunitraj06@gmail.com"
                className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-sm font-medium hover:scale-105 transition-transform duration-300"
              >
                Send an Email ✉️
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ModalContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => <div className={cn("flex flex-col flex-1 p-6", className)}>{children}</div>;

export const ModalFooter = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex justify-end p-4 bg-neutral-900 border-t border-neutral-800",
      className
    )}
  >
    {children}
  </div>
);

const Overlay = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
    className="fixed inset-0 bg-black/40 z-40"
  ></motion.div>
);

const CloseIcon = () => {
  const { setOpen } = useModal();
  return (
    <button
      onClick={() => setOpen(false)}
      className="absolute top-4 right-4 group"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white h-5 w-5 group-hover:scale-110 group-hover:rotate-3 transition duration-200"
      >
        <path d="M18 6L6 18" />
        <path d="M6 6l12 12" />
      </svg>
    </button>
  );
};

const SocialLink = ({
  href,
  icon,
  label,
  username,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  username: string;
}) => (
  <a
    href={href}
    target="_blank"
    className="flex items-center gap-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg px-4 py-3 transition duration-200"
  >
    {icon}
    <div className="flex flex-col">
      <span className="text-white font-medium">{label}</span>
      <span className="text-neutral-400 text-sm">{username}</span>
    </div>
  </a>
);

export const useOutsideClick = (
  ref: React.RefObject<HTMLElement | null>,
  callback: Function
) => {
  useEffect(() => {
    const listener = (event: any) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      callback(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};
