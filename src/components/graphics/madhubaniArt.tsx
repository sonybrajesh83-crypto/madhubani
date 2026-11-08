"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";

type ArtProps = {
  motifKey: string;
  className?: string;
  animated?: boolean;
  palette?: string[];
  dedication?: string;
  play?: boolean;
};

const palettes: Record<string, string[]> = {
  classic: ["#E6392B", "#F4C430", "#0B1D36", "#1F4D3A", "#FAFAF8"],
  monochrome: ["#111111", "#FAFAF8", "#555555", "#222222", "#FAFAF8"],
  peacock: ["#0D7377", "#14A3A8", "#F4C430", "#E6392B", "#041B1C"],
  lotus: ["#D94F70", "#7B2D8E", "#F4C430", "#0B1D36", "#FFF5F8"],
  custom: ["#E6392B", "#0D7377", "#F4C430", "#111111", "#FAFAF8"],
};

function Border({ c0, c1 }: { c0: string; c1: string }) {
  return (
    <>
      <rect x="8" y="8" width="284" height="384" fill="none" stroke={c0} strokeWidth="4" />
      <rect x="16" y="16" width="268" height="368" fill="none" stroke={c1} strokeWidth="2" />
      {Array.from({ length: 18 }).map((_, i) => (
        <circle key={`t-${i}`} cx={24 + i * 14.5} cy={24} r="3" fill={i % 2 ? c0 : c1} />
      ))}
      {Array.from({ length: 18 }).map((_, i) => (
        <circle key={`b-${i}`} cx={24 + i * 14.5} cy={376} r="3" fill={i % 2 ? c1 : c0} />
      ))}
    </>
  );
}

function Peacock({ colors }: { colors: string[] }) {
  const [c0, c1, c2, c3, bg] = colors;
  return (
    <g>
      <rect width="300" height="400" fill={bg} />
      <Border c0={c0} c1={c2} />
      <ellipse cx="150" cy="250" rx="48" ry="70" fill={c3} stroke={c0} strokeWidth="3" />
      <path d="M150 180 C120 120 80 90 70 70 C110 95 140 110 150 130 C160 110 190 95 230 70 C220 90 180 120 150 180Z" fill={c0} stroke={c3} strokeWidth="2" />
      {Array.from({ length: 7 }).map((_, i) => {
        const angle = -60 + i * 20;
        const rad = (angle * Math.PI) / 180;
        const x = 150 + Math.sin(rad) * 90;
        const y = 160 - Math.cos(rad) * 90;
        return (
          <g key={i}>
            <path
              d={`M150 200 Q${x} ${y + 40} ${x} ${y}`}
              fill="none"
              stroke={c1}
              strokeWidth="3"
            />
            <circle cx={x} cy={y} r="12" fill={c2} stroke={c0} strokeWidth="2" />
            <circle cx={x} cy={y} r="5" fill={c0} />
          </g>
        );
      })}
      <circle cx="150" cy="155" r="22" fill={c1} stroke={c3} strokeWidth="2" />
      <circle cx="143" cy="150" r="3" fill={c3} />
      <circle cx="157" cy="150" r="3" fill={c3} />
      <path d="M150 160 L150 168" stroke={c3} strokeWidth="2" />
      <path d="M150 175 C170 190 185 230 175 270" fill="none" stroke={c2} strokeWidth="4" />
    </g>
  );
}

function Fish({ colors }: { colors: string[] }) {
  const [c0, c1, c2, c3, bg] = colors;
  return (
    <g>
      <rect width="300" height="400" fill={bg} />
      <Border c0={c0} c1={c2} />
      <ellipse cx="150" cy="200" rx="90" ry="45" fill={c0} stroke={c3} strokeWidth="3" />
      <path d="M60 200 L20 170 L20 230 Z" fill={c1} stroke={c3} strokeWidth="2" />
      <circle cx="210" cy="190" r="6" fill={c3} />
      <path d="M90 175 Q150 155 210 175" fill="none" stroke={c2} strokeWidth="2" />
      <path d="M90 225 Q150 245 210 225" fill="none" stroke={c2} strokeWidth="2" />
      {Array.from({ length: 6 }).map((_, i) => (
        <path
          key={i}
          d={`M${90 + i * 20} 200 q10 -18 20 0 q-10 18 -20 0`}
          fill={c1}
          opacity="0.85"
        />
      ))}
      <circle cx="70" cy="300" r="18" fill={c2} stroke={c0} strokeWidth="2" />
      <circle cx="230" cy="110" r="18" fill={c2} stroke={c0} strokeWidth="2" />
    </g>
  );
}

function Lotus({ colors }: { colors: string[] }) {
  const [c0, c1, c2, c3, bg] = colors;
  return (
    <g>
      <rect width="300" height="400" fill={bg} />
      <Border c0={c0} c1={c2} />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = i * 45;
        return (
          <ellipse
            key={i}
            cx="150"
            cy="200"
            rx="28"
            ry="70"
            fill={i % 2 ? c0 : c1}
            stroke={c3}
            strokeWidth="2"
            transform={`rotate(${angle} 150 200)`}
            opacity="0.95"
          />
        );
      })}
      <circle cx="150" cy="200" r="28" fill={c2} stroke={c3} strokeWidth="3" />
      <circle cx="150" cy="200" r="12" fill={c0} />
      <path d="M40 320 Q150 280 260 320" fill="none" stroke={c3} strokeWidth="3" />
      <path d="M60 340 Q150 300 240 340" fill="none" stroke={c0} strokeWidth="2" />
    </g>
  );
}

function TreeOfLife({ colors }: { colors: string[] }) {
  const [c0, c1, c2, c3, bg] = colors;
  return (
    <g>
      <rect width="300" height="400" fill={bg} />
      <Border c0={c0} c1={c2} />
      <path d="M150 340 L150 180" stroke={c3} strokeWidth="8" />
      <path d="M150 250 C90 220 70 170 80 120" fill="none" stroke={c0} strokeWidth="4" />
      <path d="M150 250 C210 220 230 170 220 120" fill="none" stroke={c0} strokeWidth="4" />
      <path d="M150 210 C110 180 100 140 110 100" fill="none" stroke={c1} strokeWidth="3" />
      <path d="M150 210 C190 180 200 140 190 100" fill="none" stroke={c1} strokeWidth="3" />
      {[
        [80, 120],
        [220, 120],
        [110, 100],
        [190, 100],
        [150, 90],
        [60, 160],
        [240, 160],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="14" fill={c2} stroke={c3} strokeWidth="2" />
          <circle cx={x} cy={y} r="5" fill={c0} />
        </g>
      ))}
      <ellipse cx="150" cy="350" rx="70" ry="12" fill={c0} opacity="0.35" />
    </g>
  );
}

function Kohbar({ colors }: { colors: string[] }) {
  const [c0, c1, c2, c3, bg] = colors;
  return (
    <g>
      <rect width="300" height="400" fill={bg} />
      <Border c0={c0} c1={c2} />
      <rect x="70" y="90" width="160" height="220" fill="none" stroke={c3} strokeWidth="4" />
      <rect x="90" y="110" width="120" height="180" fill={c0} opacity="0.12" stroke={c0} strokeWidth="2" />
      <circle cx="150" cy="180" r="36" fill={c1} stroke={c3} strokeWidth="3" />
      <circle cx="150" cy="180" r="16" fill={c2} />
      <path d="M110 250 h80" stroke={c3} strokeWidth="3" />
      <path d="M120 270 h60" stroke={c0} strokeWidth="2" />
      <path d="M100 140 L150 100 L200 140" fill="none" stroke={c2} strokeWidth="3" />
      {Array.from({ length: 5 }).map((_, i) => (
        <rect
          key={i}
          x={100 + i * 20}
          y="300"
          width="12"
          height="28"
          fill={i % 2 ? c0 : c2}
          stroke={c3}
        />
      ))}
    </g>
  );
}

function RadhaKrishna({ colors }: { colors: string[] }) {
  const [c0, c1, c2, c3, bg] = colors;
  return (
    <g>
      <rect width="300" height="400" fill={bg} />
      <Border c0={c0} c1={c2} />
      <circle cx="115" cy="150" r="28" fill={c1} stroke={c3} strokeWidth="2" />
      <circle cx="185" cy="150" r="28" fill={c2} stroke={c3} strokeWidth="2" />
      <path d="M115 178 C115 240 95 280 95 310" stroke={c3} strokeWidth="8" fill="none" />
      <path d="M185 178 C185 240 205 280 205 310" stroke={c3} strokeWidth="8" fill="none" />
      <path d="M95 250 C140 230 160 230 205 250" fill="none" stroke={c0} strokeWidth="3" />
      <path d="M150 120 C160 80 200 70 210 100" fill="none" stroke={c0} strokeWidth="4" />
      <circle cx="210" cy="95" r="8" fill={c1} />
      <path d="M40 330 Q150 290 260 330" fill="none" stroke={c2} strokeWidth="3" />
    </g>
  );
}

function Elephant({ colors }: { colors: string[] }) {
  const [c0, c1, c2, c3, bg] = colors;
  return (
    <g>
      <rect width="300" height="400" fill={bg} />
      <Border c0={c0} c1={c2} />
      <ellipse cx="150" cy="220" rx="70" ry="55" fill={c1} stroke={c3} strokeWidth="3" />
      <circle cx="210" cy="180" r="36" fill={c1} stroke={c3} strokeWidth="3" />
      <path d="M230 200 C250 250 245 300 235 320" fill="none" stroke={c0} strokeWidth="10" strokeLinecap="round" />
      <circle cx="222" cy="172" r="4" fill={c3} />
      <rect x="110" y="260" width="18" height="55" fill={c2} stroke={c3} />
      <rect x="150" y="265" width="18" height="50" fill={c2} stroke={c3} />
      <path d="M100 190 Q150 150 200 190" fill="none" stroke={c0} strokeWidth="3" />
      <circle cx="150" cy="175" r="10" fill={c0} />
    </g>
  );
}

function Sun({ colors }: { colors: string[] }) {
  const [c0, c1, c2, c3, bg] = colors;
  return (
    <g>
      <rect width="300" height="400" fill={bg} />
      <Border c0={c0} c1={c2} />
      <circle cx="150" cy="200" r="55" fill={c1} stroke={c3} strokeWidth="3" />
      <circle cx="150" cy="200" r="28" fill={c0} />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 150 + Math.cos(angle) * 70;
        const y1 = 200 + Math.sin(angle) * 70;
        const x2 = 150 + Math.cos(angle) * 110;
        const y2 = 200 + Math.sin(angle) * 110;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={i % 2 ? c0 : c2}
            strokeWidth="6"
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

function renderMotif(motifKey: string, colors: string[]) {
  switch (motifKey) {
    case "fish":
      return <Fish colors={colors} />;
    case "lotus":
      return <Lotus colors={colors} />;
    case "treeOfLife":
      return <TreeOfLife colors={colors} />;
    case "kohbar":
      return <Kohbar colors={colors} />;
    case "radhaKrishna":
      return <RadhaKrishna colors={colors} />;
    case "elephant":
      return <Elephant colors={colors} />;
    case "sun":
      return <Sun colors={colors} />;
    case "peacock":
    default:
      return <Peacock colors={colors} />;
  }
}

export function MadhubaniArt({
  motifKey,
  className,
  animated = true,
  palette,
  dedication,
  play = false,
}: ArtProps) {
  const colors = palette && palette.length >= 5 ? palette : palettes.classic;

  return (
    <div className={cn("relative overflow-hidden bg-[#FAFAF8]", className)}>
      <motion.svg
        viewBox="0 0 300 400"
        className="h-full w-full"
        animate={
          play
            ? { rotate: [0, 1.2, -1.2, 0], scale: [1, 1.02, 1] }
            : animated
              ? { y: [0, -4, 0] }
              : undefined
        }
        transition={
          play
            ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
            : { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {renderMotif(motifKey, colors)}
      </motion.svg>
      {dedication ? (
        <div className="absolute inset-x-4 bottom-4 rounded-sm bg-[#0B1D36]/80 px-3 py-2 text-center text-xs tracking-wide text-[#F4C430]">
          {dedication}
        </div>
      ) : null}
    </div>
  );
}

export function MotifPatternBg({ className }: { className?: string }) {
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="mithila" width="48" height="48" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="2" fill="currentColor" />
          <circle cx="32" cy="24" r="2" fill="currentColor" />
          <path d="M0 24h48M24 0v48" stroke="currentColor" strokeWidth="0.5" />
          <path d="M12 36c6-6 18-6 24 0" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mithila)" />
    </svg>
  );
}
