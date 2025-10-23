"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const BackgroundRippleEffect = ({
  cellSize = 56,
  className,
  interactive = false,   // default off; it’s a background
}: {
  cellSize?: number;
  className?: string;
  interactive?: boolean;
}) => {
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [clickedCell, setClickedCell] = useState<{ row: number; col: number } | null>(null);
  const [rippleKey, setRippleKey] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  // Fit grid to the entire viewport
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setCols(Math.ceil(w / cellSize) + 2); // pad edges
      setRows(Math.ceil(h / cellSize) + 2);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [cellSize]);

  // Listen for logo click -> ripple from cursor (or center if no coords)
  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<{ x?: number; y?: number }>;
      const rect = ref.current?.getBoundingClientRect();

      let row = Math.floor(rows / 2);
      let col = Math.floor(cols / 2);

      if (rect && ev.detail && typeof ev.detail.x === "number" && typeof ev.detail.y === "number") {
        const relX = ev.detail.x - rect.left;
        const relY = ev.detail.y - rect.top;
        col = Math.max(0, Math.min(cols - 1, Math.floor(relX / cellSize)));
        row = Math.max(0, Math.min(rows - 1, Math.floor(relY / cellSize)));
      }
      setClickedCell({ row, col });
      setRippleKey((k) => k + 1);
    };

    window.addEventListener("trigger-ripple", handler as EventListener);
    return () => window.removeEventListener("trigger-ripple", handler as EventListener);
  }, [rows, cols, cellSize]);

  return (
    <div
      ref={ref}
      className={cn(
        // full-page, behind everything
        "fixed inset-0 -z-10 h-full w-full bg-neutral-950",
        "[--cell-border-color:var(--color-neutral-800)] [--cell-fill-color:var(--color-neutral-900)] [--cell-shadow-color:var(--color-neutral-800)]",
        className
      )}
    >
      <DivGrid
        key={`grid-${rippleKey}`}
        rows={rows}
        cols={cols}
        cellSize={cellSize}
        borderColor="var(--cell-border-color)"
        fillColor="var(--cell-fill-color)"
        clickedCell={clickedCell}
        onCellClick={(r, c) => {
          if (!interactive) return;
          setClickedCell({ row: r, col: c });
          setRippleKey((k) => k + 1);
        }}
        interactive={interactive}
      />
    </div>
  );
};

type DivGridProps = {
  className?: string;
  rows: number;
  cols: number;
  cellSize: number;
  borderColor: string;
  fillColor: string;
  clickedCell: { row: number; col: number } | null;
  onCellClick?: (row: number, col: number) => void;
  interactive?: boolean;
};

type CellStyle = React.CSSProperties & {
  ["--delay"]?: string;
  ["--duration"]?: string;
};

const DivGrid = ({
  className,
  rows,
  cols,
  cellSize,
  borderColor,
  fillColor,
  clickedCell,
  onCellClick = () => {},
  interactive = false,
}: DivGridProps) => {
  const cells = useMemo(() => Array.from({ length: rows * cols }, (_, i) => i), [rows, cols]);

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    width: cols * cellSize,
    height: rows * cellSize,
  };

  return (
    <div className={cn("relative", className)} style={gridStyle}>
      {cells.map((idx) => {
        const rowIdx = Math.floor(idx / cols);
        const colIdx = idx % cols;

        // Wave timing: farther cells start later -> clean traveling wave
        const distance = clickedCell ? Math.hypot(clickedCell.row - rowIdx, clickedCell.col - colIdx) : 0;
        const delay = clickedCell ? distance * 45 : 0;        // ms per ring
        const duration = 280 + distance * 70;                 // ms grows slightly with distance

        const style: CellStyle = clickedCell ? {
          "--delay": `${delay}ms`,
          "--duration": `${duration}ms`,
        } : {};

        return (
          <div
            key={idx}
            className={cn(
              "border-[0.5px] opacity-40 transition-opacity duration-150 will-change-transform",
              "dark:shadow-[0_0_40px_1px_var(--cell-shadow-color)_inset]",
              clickedCell && "animate-cell-ripple [animation-fill-mode:none]",
              !interactive && "pointer-events-none"
            )}
            style={{ backgroundColor: fillColor, borderColor, ...style }}
            onClick={interactive ? () => onCellClick?.(rowIdx, colIdx) : undefined}
          />
        );
      })}
    </div>
  );
};
