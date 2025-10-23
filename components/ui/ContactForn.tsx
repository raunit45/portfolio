"use client";
import { useEffect, useRef } from "react";

export default function ContactForm() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight / 2); // 👈 half height

    const cols = 60;
    const rows = 15;
    const spacingX = width / cols;
    const spacingY = height / rows;

    const dots: { x: number; y: number; baseSize: number }[] = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        dots.push({
          x: i * spacingX + spacingX / 2,
          y: j * spacingY + spacingY / 2,
          baseSize: Math.random() * 2 + 1,
        });
      }
    }

    let mouse = { x: 0, y: 0 };
    const lightRadius = 150;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)"; // 60% transparent
      ctx.fillRect(0, 0, width, height);

      dots.forEach((dot) => {
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const scale = Math.max(0, 1 - dist / lightRadius);
        const size = dot.baseSize + scale * 6;

        const glow = Math.max(0, 1 - dist / (lightRadius * 1.5));
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.1 + glow * 0.9})`;
        ctx.shadowColor = `rgba(255,255,255,${glow})`;
        ctx.shadowBlur = glow * 25;
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight / 2; // 👈 keep half height on resize
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative w-screen h-[50vh] bg-black/60 overflow-hidden"> {/* 👈 50% viewport height */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full"
      />
      <div className="absolute top-10 left-0 right-0 text-center text-white text-4xl font-light tracking-wider">
        {/* You can add text or leave it clean */}
      </div>
    </div>
  );
}
