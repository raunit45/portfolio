"use client";

import { motion } from "motion/react";

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-neutral-100">
      <motion.button
        whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(59,130,246,0.7)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 250, damping: 15 }}
        onClick={() =>
          window.open(
            "mailto:raunitraj06@gmail.com?subject=Let's Connect&body=Hi Raunit,",
            "_self"
          )
        }
        className="relative group px-8 py-4 text-xl font-semibold rounded-full overflow-hidden
                   bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white
                   shadow-lg cursor-pointer"
      >
        <span className="relative z-10">Contact Me</span>
        <div
          className="absolute inset-0 bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500
                     opacity-0 group-hover:opacity-100 blur-lg transition duration-500"
        ></div>
      </motion.button>

      <p className="text-neutral-400 text-sm mt-6">
        Click to open your email client and reach me directly ✉️
      </p>
    </div>
  );
}
