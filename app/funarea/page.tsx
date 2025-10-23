"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GAME, RESUME_PDF_PATH, SECTIONS, type SectionInfo } from "@/lib/resume";

/* ========= keyboard ========= */
function useKeys() {
  const keys = useRef({ up: false, down: false, left: false, right: false });
  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      if (["ArrowUp", "w", "W"].includes(e.key)) keys.current.up = true;
      if (["ArrowDown", "s", "S"].includes(e.key)) keys.current.down = true;
      if (["ArrowLeft", "a", "A"].includes(e.key)) keys.current.left = true;
      if (["ArrowRight", "d", "D"].includes(e.key)) keys.current.right = true;
    };
    const up = (e: KeyboardEvent) => {
      if (["ArrowUp", "w", "W"].includes(e.key)) keys.current.up = false;
      if (["ArrowDown", "s", "S"].includes(e.key)) keys.current.down = false;
      if (["ArrowLeft", "a", "A"].includes(e.key)) keys.current.left = false;
      if (["ArrowRight", "d", "D"].includes(e.key)) keys.current.right = false;
    };
    window.addEventListener("keydown", dn);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", dn);
      window.removeEventListener("keyup", up);
    };
  }, []);
  return keys;
}

/* ========= math helpers ========= */
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const rand = (a: number, b: number) => a + Math.random() * (b - a);

/* ========= drawing ========= */
const SKY = "#04050a";

function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  // Fill
  ctx.fillStyle = SKY;
  ctx.fillRect(0, 0, w, h);

  // Stars
  const base = Math.floor(t / 50);
  for (let i = 0; i < 180; i++) {
    const x = (i * 137 + base * 61) % w;
    const y = (i * 97 + base * 43) % h;
    const r = (i % 7 === 0) ? 1.7 : 0.9;
    ctx.globalAlpha = (i % 5 === 0) ? 0.9 : 0.5;
    ctx.fillStyle = ["#8ab4ff", "#b388ff", "#ffffff"][i % 3];
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Parallax streaks
  const bands = 4;
  for (let i = 0; i < bands; i++) {
    const off = (t * (0.03 + i * 0.02)) % w;
    ctx.globalAlpha = 0.06 + i * 0.02;
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, "transparent");
    g.addColorStop(0.5, ["#7dd3fc", "#c084fc", "#60a5fa", "#22d3ee"][i % 4]);
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(-off, h * (0.18 + i * 0.15), w, 8);
    ctx.fillRect(w - off, h * (0.12 + i * 0.15), w, 6);
  }
  ctx.globalAlpha = 1;
}

function drawShip(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Basket-ship
  ctx.save();
  ctx.translate(x, y);
  // hull
  ctx.fillStyle = "#8b5cf6";
  ctx.beginPath();
  ctx.moveTo(-28, 0);
  ctx.lineTo(28, 0);
  ctx.lineTo(18, 24);
  ctx.lineTo(-18, 24);
  ctx.closePath();
  ctx.fill();
  // rim
  ctx.fillStyle = "#a5b4fc";
  ctx.fillRect(-30, 0, 60, 5);
  // glow
  const g = ctx.createLinearGradient(0, 0, 0, 36);
  g.addColorStop(0, "rgba(59,130,246,0.7)");
  g.addColorStop(1, "rgba(59,130,246,0)");
  ctx.fillStyle = g;
  ctx.fillRect(-10, 24, 20, 22);
  ctx.restore();
}

function drawDrop(ctx: CanvasRenderingContext2D, x: number, y: number, s: SectionInfo) {
  ctx.save();
  ctx.translate(x, y);
  ctx.shadowBlur = 12;
  ctx.shadowColor = s.color;
  ctx.fillStyle = s.color;
  ctx.beginPath();
  ctx.arc(0, 0, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#e5e7eb";
  ctx.font = "600 12px ui-sans-serif, system-ui";
  ctx.textAlign = "center";
  ctx.fillText(s.key, 0, -28);
  ctx.restore();
}

/** Center-top HUD with rounded pill background (prevents clipping behind edges) */
function drawHUD(
  ctx: CanvasRenderingContext2D,
  caught: number,
  total: number,
  hint?: SectionInfo
) {
  ctx.save();

  const cx = GAME.worldWidth / 2;
  const topY = 10;
  const padX = 16;
  const padY = 10;

  // compute sizes
  ctx.font = "600 14px ui-sans-serif, system-ui";
  const mainText = `Caught: ${caught}/${total}`;
  const mainW = ctx.measureText(mainText).width;

  let sub1 = "";
  let sub2 = "";
  if (hint) {
    sub1 = hint.key;
    sub2 = hint.lines?.[0] ?? "";
  }

  ctx.font = "500 12px ui-sans-serif, system-ui";
  const w1 = sub1 ? ctx.measureText(sub1).width : 0;
  const w2 = sub2 ? ctx.measureText(sub2).width : 0;

  const maxW = Math.max(mainW, w1, w2);
  const pillW = maxW + padX * 2;
  const pillH =
    // main line (18) + maybe two sub lines (2 * 16) + padding
    (hint ? 18 + 16 + (sub2 ? 16 : 0) : 18) + padY * 2;

  // draw rounded pill
  const x = cx - pillW / 2;
  const y = topY;
  const r = 12;

  ctx.fillStyle = "rgba(17,24,39,0.65)"; // bg-neutral-900/65
  ctx.strokeStyle = "rgba(120,120,120,0.35)";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + pillW - r, y);
  ctx.quadraticCurveTo(x + pillW, y, x + pillW, y + r);
  ctx.lineTo(x + pillW, y + pillH - r);
  ctx.quadraticCurveTo(x + pillW, y + pillH, x + pillW - r, y + pillH);
  ctx.lineTo(x + r, y + pillH);
  ctx.quadraticCurveTo(x, y + pillH, x, y + pillH - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // texts
  const textX = cx;
  let textY = y + padY + 12;

  ctx.fillStyle = "rgba(229,231,235,0.95)";
  ctx.font = "600 14px ui-sans-serif, system-ui";
  ctx.textAlign = "center";
  ctx.fillText(mainText, textX, textY);

  if (hint) {
    ctx.font = "600 12px ui-sans-serif, system-ui";
    textY += 18;
    ctx.fillText(sub1, textX, textY);

    if (sub2) {
      ctx.font = "500 12px ui-sans-serif, system-ui";
      textY += 16;
      ctx.fillText(sub2, textX, textY);
    }
  }

  ctx.restore();
}

/* ========= game page ========= */
type Drop = {
  s: SectionInfo;
  x: number;
  y: number;
  vy: number; // fall speed
  alive: boolean;
};

export default function FunareaPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const keys = useKeys();
  const router = useRouter();

  const [won, setWon] = useState(false);       // unlock state
  const [lastCaught, setLastCaught] = useState<SectionInfo | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;

    // fit canvas
    const fit = () => {
      canvas.width = GAME.worldWidth * devicePixelRatio;
      canvas.height = GAME.worldHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    fit();
    window.addEventListener("resize", fit);

    // player state
    let x = GAME.worldWidth / 2;
    let y = GAME.worldHeight - 80;
    const speed = 360; // px/s
    const bounds = {
      minX: 40,
      maxX: GAME.worldWidth - 40,
      minY: 40,
      maxY: GAME.worldHeight - 40,
    };

    // drops
    const queue = SECTIONS.slice();      // copy
    const drops: Drop[] = [];
    let spawnTimer = 0;
    let caught = 0;

    // time
    let prev = performance.now();

    const spawnOne = () => {
      if (!queue.length) return;
      const s = queue.shift()!;
      drops.push({
        s,
        x: rand(60, GAME.worldWidth - 60),
        y: -30,
        vy: rand(GAME.fallSpeedMin, GAME.fallSpeedMax),
        alive: true,
      });
    };

    function loop(now: number) {
      const dt = (now - prev) / 1000;
      prev = now;

      // spawn logic
      spawnTimer += dt * 1000;
      if (spawnTimer >= GAME.spawnDelayMs) {
        spawnTimer = 0;
        spawnOne();
      }

      // input
      const k = keys.current;
      const vx = (k.right ? 1 : 0) - (k.left ? 1 : 0);
      const vy = (k.down ? 1 : 0) - (k.up ? 1 : 0);
      x = clamp(x + vx * speed * dt, bounds.minX, bounds.maxX);
      y = clamp(y + vy * speed * dt, bounds.minY, bounds.maxY);

      // update drops
      let hint: SectionInfo | undefined;
      for (const d of drops) {
        if (!d.alive) continue;
        d.y += d.vy * dt;

        // collision with basket
        const dx = d.x - x;
        const dy = d.y - y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 <= GAME.catchRadius * GAME.catchRadius) {
          d.alive = false;
          caught++;
          setLastCaught(d.s);
          if (caught >= SECTIONS.length) {
            setWon(true);
          }
        } else if (Math.abs(dx) < 120 && dy > -40 && dy < 140 && !hint) {
          hint = d.s; // show closest drop hint text
        }

        // off screen → recycle (if not yet caught)
        if (d.y > GAME.worldHeight + 40 && d.alive) {
          // respawn same section later so player must catch it eventually
          d.alive = false;
          queue.push(d.s);
        }
      }

      // clear + draw
      drawBackground(ctx, GAME.worldWidth, GAME.worldHeight, now);
      // ship
      drawShip(ctx, x, y);
      // active drops
      for (const d of drops) if (d.alive) drawDrop(ctx, d.x, d.y, d.s);
      // HUD (center-top)
      drawHUD(ctx, caught, SECTIONS.length, hint);

      if (!won) raf = requestAnimationFrame(loop);
    }

    // start with one falling item
    spawnOne();
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
    };
  }, [keys, won]);

  const goHome = () => router.push("/");

  return (
    <div className="fixed inset-0 bg-black">
      {/* Persistent Back/Home button (can stay top-left; HUD is centered) */}
      <button
        onClick={goHome}
        className="absolute top-4 left-4 z-20 rounded-full px-3 py-1.5 bg-neutral-900/80 text-neutral-200 border border-neutral-700 hover:bg-neutral-800 transition"
        aria-label="Go to homepage"
      >
        ← Home
      </button>

      <canvas
        ref={canvasRef}
        className="block mx-auto"
        style={{ width: GAME.worldWidth, height: GAME.worldHeight }}
      />

      {/* overlay help — CENTER TOP, under the HUD */}
      {!won && (
        <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 z-20 text-neutral-300 text-sm text-center space-y-1">
          <div className="font-semibold">🧺 Catch the falling sections</div>
          <div>Move with ← → ↑ ↓ / WASD</div>
          <div>Catch all to unlock your resume</div>
        </div>
      )}

      {/* win modal */}
      {won && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative rounded-2xl border border-neutral-700 bg-neutral-900 p-6 w-[420px] text-center">
            {/* Close (keep playing) */}
            <button
              onClick={() => setWon(false)}
              className="absolute top-3 right-3 h-8 w-8 grid place-items-center rounded-md border border-neutral-700 text-neutral-300 hover:bg-neutral-800"
              aria-label="Close"
              title="Close"
            >
              ✕
            </button>

            <div className="text-2xl font-bold text-white">🎉 Resume Unlocked</div>
            <p className="text-neutral-300 mt-2">
              Nice catch! You collected all sections of your resume.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <a
                href={RESUME_PDF_PATH}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
              >
                View Resume
              </a>
              <a
                href={RESUME_PDF_PATH}
                download
                className="rounded-lg px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold"
              >
                Download PDF
              </a>
              <button
                onClick={goHome}
                className="col-span-2 rounded-lg px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-semibold border border-neutral-700"
              >
                Back to Home
              </button>
            </div>

            <div className="mt-6 text-xs text-neutral-400">
              Tip: You can keep playing — items will keep falling.
            </div>
          </div>
        </div>
      )}

      {/* last caught toast */}
      {lastCaught && !won && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm px-3 py-2 rounded-lg bg-neutral-900/80 border border-neutral-700 text-neutral-200">
          Caught:{" "}
          <span className="font-semibold" style={{ color: lastCaught.color }}>
            {lastCaught.key}
          </span>
        </div>
      )}
    </div>
  );
}
