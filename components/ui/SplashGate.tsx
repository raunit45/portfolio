"use client";

import React, { useEffect, useMemo, useState } from "react";

type Props = { children: React.ReactNode };

export default function SplashGate({ children }: Props) {
  const [show, setShow] = useState(false);
  const [idx, setIdx] = useState(0);

  // Your name in 10 languages/transliterations (edit freely)
  const names = useMemo(
    () => [
      { txt: "Raunit Raj", lang: "English" },
      { txt: "रौनित राज", lang: "हिन्दी" },
      { txt: "Раунит Радж", lang: "Русский" },
      { txt: "رونيت راج", lang: "العربية" },
      { txt: "ラウニット・ラージ", lang: "日本語" },
      { txt: "라우닛 라즈", lang: "한국어" },
      { txt: "拉乌尼特·拉杰", lang: "中文" },
      { txt: "রউনিত রাজ", lang: "বাংলা" },
      { txt: "રૌનિત રાજ", lang: "ગુજરાતી" },
      { txt: "Raunit Raj", lang: "Español" },
    ],
    []
  );

  useEffect(() => {
    // Only show once per browser session
    const seen = sessionStorage.getItem("seenSplash");
    if (!seen) {
      setShow(true);
      const intervalMs = 250; // 10 names * 250ms = 2500ms
      const intId = setInterval(() => {
        setIdx((i) => (i + 1) % names.length);
      }, intervalMs);

      const timeout = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("seenSplash", "1");
        clearInterval(intId);
      }, 2500);

      return () => {
        clearInterval(intId);
        clearTimeout(timeout);
      };
    }
  }, [names.length]);

  if (!show) return <>{children}</>;

  return (
    <>
      {/* content renders, but splash sits above it and blocks clicks */}
      {children}
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-neutral-950">
        <div className="text-center">
          <div className="text-3xl sm:text-5xl font-bold tracking-wide transition-opacity duration-200 ease-out">
            {names[idx].txt}
          </div>
          <div className="mt-2 text-sm text-neutral-400">{names[idx].lang}</div>
        </div>
      </div>
    </>
  );
}
