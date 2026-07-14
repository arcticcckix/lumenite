"use client";

import { useId, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Geometry, equirectangular projection over an 800 x 400 canvas            */
/* -------------------------------------------------------------------------- */

const MAP_W = 800;
const MAP_H = 400;

const projX = (lon: number): number => ((lon + 180) / 360) * MAP_W;
const projY = (lat: number): number => ((90 - lat) / 180) * MAP_H;

const round = (n: number): number => Math.round(n * 100) / 100;

/**
 * Hand-traced, generalised continent outlines in [lon, lat]. Point-in-polygon
 * against these masks a uniform pixel grid down to a dotted world silhouette,
 * no bitmap, no external data, fully deterministic.
 */
const CONTINENTS: number[][][] = [
  // North America
  [
    [-165, 62], [-156, 71], [-140, 70], [-125, 70], [-108, 68], [-95, 69],
    [-82, 73], [-70, 66], [-60, 58], [-56, 51], [-64, 48], [-70, 42],
    [-75, 37], [-80, 31], [-80, 25], [-90, 29], [-97, 26], [-98, 20],
    [-95, 16], [-105, 20], [-112, 24], [-117, 32], [-124, 42], [-128, 52],
    [-140, 59],
  ],
  // South America
  [
    [-77, 8], [-72, 11], [-62, 10], [-52, 5], [-50, 0], [-44, -2], [-35, -6],
    [-39, -13], [-40, -20], [-48, -25], [-55, -34], [-62, -40], [-66, -45],
    [-69, -52], [-74, -50], [-73, -43], [-71, -33], [-70, -23], [-71, -18],
    [-77, -12], [-81, -5], [-80, -2], [-78, 3],
  ],
  // Africa
  [
    [-6, 35], [2, 37], [10, 34], [20, 32], [28, 31], [32, 31], [34, 29],
    [37, 20], [43, 11], [51, 11], [48, 4], [42, -2], [40, -10], [40, -16],
    [36, -20], [33, -26], [28, -33], [20, -35], [15, -28], [12, -20],
    [11, -15], [9, -5], [9, 3], [3, 5], [-4, 5], [-8, 4], [-13, 8], [-16, 13],
    [-17, 19], [-16, 24], [-13, 28], [-10, 31],
  ],
  // Eurasia (Europe + Asia are one landmass)
  [
    [-9, 43], [-9, 37], [-6, 36], [-2, 36], [3, 42], [6, 43], [9, 44],
    [13, 45], [16, 43], [19, 42], [23, 40], [27, 40], [30, 37], [36, 36],
    [35, 33], [34, 30], [40, 17], [43, 13], [52, 15], [57, 22], [56, 26],
    [61, 25], [66, 25], [68, 23], [72, 20], [74, 15], [77, 8], [80, 13],
    [83, 17], [87, 21], [91, 22], [95, 17], [98, 12], [102, 6], [104, 1],
    [106, 10], [109, 13], [108, 18], [110, 21], [113, 22], [117, 23],
    [121, 29], [121, 37], [122, 40], [126, 40], [129, 35], [130, 42],
    [135, 44], [140, 46], [142, 53], [150, 59], [156, 61], [162, 60],
    [170, 61], [178, 65], [180, 66], [180, 71], [160, 72], [140, 73],
    [120, 74], [100, 76], [80, 74], [68, 73], [60, 71], [55, 69], [48, 68],
    [42, 67], [38, 66], [33, 69], [28, 71], [22, 70], [16, 68], [12, 65],
    [10, 63], [7, 63], [5, 61], [6, 58], [8, 57], [10, 54], [6, 53], [3, 51],
    [1, 50], [-2, 48], [-2, 44],
  ],
  // Australia
  [
    [114, -22], [114, -30], [118, -34], [125, -33], [132, -32], [138, -35],
    [144, -38], [147, -38], [150, -37], [153, -28], [146, -19], [142, -11],
    [136, -12], [130, -12], [128, -15], [122, -18],
  ],
  // Greenland
  [
    [-45, 60], [-52, 64], [-50, 70], [-40, 76], [-25, 78], [-18, 73],
    [-22, 68], [-30, 64], [-42, 60],
  ],
  // Japan
  [
    [131, 31], [134, 34], [137, 35], [140, 36], [141, 39], [142, 42],
    [141, 45], [144, 44], [141, 38], [137, 34], [134, 33],
  ],
  // Great Britain
  [[-5, 50], [-3, 53], [-5, 55], [-3, 58], [-1, 57], [0, 53], [1, 51], [-2, 50]],
  // Ireland
  [[-10, 52], [-10, 55], [-6, 55], [-6, 52]],
  // Iceland
  [[-24, 64], [-22, 66], [-18, 66], [-14, 65], [-18, 64], [-22, 63]],
  // Madagascar
  [[43, -16], [46, -13], [50, -15], [50, -20], [47, -25], [45, -22], [43, -19]],
  // New Zealand
  [
    [166, -46], [168, -46], [171, -43], [174, -41], [178, -38], [177, -40],
    [173, -42], [169, -44],
  ],
  // New Guinea
  [[131, -1], [138, -2], [144, -4], [147, -8], [142, -10], [136, -9], [132, -6]],
  // Sumatra
  [[95, 5], [99, 3], [104, -2], [106, -6], [102, -4], [97, 1]],
  // Borneo
  [[109, 2], [114, 4], [118, 2], [117, -3], [111, -3], [109, -1]],
  // Java
  [[105, -6], [112, -8], [114, -8], [110, -7], [106, -6]],
  // Sulawesi
  [[119, 1], [121, -1], [123, -3], [125, -5], [122, -2], [120, 1]],
  // Philippines
  [[121, 6], [125, 8], [126, 13], [123, 16], [120, 13], [120, 8]],
  // Sri Lanka
  [[80, 6], [82, 7], [82, 9], [80, 9]],
  // Cuba / Greater Antilles
  [[-84, 22], [-80, 23], [-74, 20], [-78, 20], [-83, 21]],
  // Tasmania
  [[145, -41], [148, -41], [148, -43], [145, -43]],
];

const PROJECTED: number[][][] = CONTINENTS.map((poly) =>
  poly.map(([lon, lat]) => [projX(lon), projY(lat)])
);

function pointInPolygon(x: number, y: number, poly: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0];
    const yi = poly[i][1];
    const xj = poly[j][0];
    const yj = poly[j][1];
    const intersects =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

interface Dot {
  x: number;
  y: number;
  r: number;
  o: number;
}

/** Uniform pixel grid, masked to land, computed once at module load. */
const LAND_DOTS: Dot[] = (() => {
  const dots: Dot[] = [];
  const step = 10;
  for (let x = step; x < MAP_W; x += step) {
    for (let y = 22; y < 336; y += step) {
      let land = false;
      for (let p = 0; p < PROJECTED.length; p++) {
        if (pointInPolygon(x, y, PROJECTED[p])) {
          land = true;
          break;
        }
      }
      if (!land) continue;
      const seed = Math.abs(Math.sin(x * 12.9898 + y * 78.233));
      dots.push({
        x,
        y,
        r: round(0.85 + seed * 0.7),
        o: Math.round((0.16 + seed * 0.46) * 1000) / 1000,
      });
    }
  }
  return dots;
})();

/* -------------------------------------------------------------------------- */
/*  Cities & connections                                                      */
/* -------------------------------------------------------------------------- */

export interface City {
  lon: number;
  lat: number;
  label: string;
}

export interface Connection {
  from: City;
  to: City;
  /** Stagger in seconds so the network pulses in sequence rather than in sync. */
  delay?: number;
}

const CITY = {
  sf: { lon: -122, lat: 37, label: "San Francisco" },
  ny: { lon: -74, lat: 40, label: "New York" },
  london: { lon: -0.1, lat: 51, label: "London" },
  saoPaulo: { lon: -46, lat: -23, label: "São Paulo" },
  lagos: { lon: 3, lat: 6, label: "Lagos" },
  dubai: { lon: 55, lat: 25, label: "Dubai" },
  singapore: { lon: 103, lat: 1.3, label: "Singapore" },
  tokyo: { lon: 139, lat: 35, label: "Tokyo" },
  sydney: { lon: 151, lat: -33, label: "Sydney" },
} satisfies Record<string, City>;

const DEFAULT_CONNECTIONS: Connection[] = [
  { from: CITY.sf, to: CITY.ny, delay: 0 },
  { from: CITY.ny, to: CITY.london, delay: 0.5 },
  { from: CITY.london, to: CITY.dubai, delay: 1 },
  { from: CITY.dubai, to: CITY.singapore, delay: 1.5 },
  { from: CITY.singapore, to: CITY.tokyo, delay: 2 },
  { from: CITY.tokyo, to: CITY.sf, delay: 2.5 },
  { from: CITY.singapore, to: CITY.sydney, delay: 1.2 },
  { from: CITY.saoPaulo, to: CITY.lagos, delay: 0.8 },
];

interface Pt {
  x: number;
  y: number;
}

function quadLength(a: Pt, cp: Pt, b: Pt): number {
  let len = 0;
  let px = a.x;
  let py = a.y;
  const segs = 26;
  for (let i = 1; i <= segs; i++) {
    const t = i / segs;
    const mt = 1 - t;
    const x = mt * mt * a.x + 2 * mt * t * cp.x + t * t * b.x;
    const y = mt * mt * a.y + 2 * mt * t * cp.y + t * t * b.y;
    len += Math.hypot(x - px, y - py);
    px = x;
    py = y;
  }
  return len;
}

interface Arc {
  d: string;
  dash: number;
  gap: number;
  len: number;
  delay: number;
}

function buildArc(from: City, to: City, delay: number): Arc {
  const a: Pt = { x: projX(from.lon), y: projY(from.lat) };
  const b: Pt = { x: projX(to.lon), y: projY(to.lat) };
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy) || 1;
  // Bow every arc toward the pole (upward) for a great-circle feel.
  let nx = -dy / dist;
  let ny = dx / dist;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const curve = dist * 0.22;
  const cp: Pt = { x: mx + nx * curve, y: my + ny * curve };
  const len = quadLength(a, cp, b);
  return {
    d: `M ${round(a.x)} ${round(a.y)} Q ${round(cp.x)} ${round(cp.y)} ${round(
      b.x
    )} ${round(b.y)}`,
    dash: Math.round(len * 0.15),
    gap: Math.round(len * 1.4),
    len: Math.round(len),
    delay,
  };
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export interface WorldMapProps {
  className?: string;
  connections?: Connection[];
  showLabels?: boolean;
}

export function WorldMap({
  className,
  connections = DEFAULT_CONNECTIONS,
  showLabels = false,
}: WorldMapProps) {
  const uid = useId().replace(/[:]/g, "");
  const blurId = `wm-blur-${uid}`;

  const arcs = useMemo(
    () =>
      connections.map((c, i) =>
        buildArc(c.from, c.to, c.delay ?? i * 0.4)
      ),
    [connections]
  );

  const cities = useMemo(() => {
    const map = new Map<string, City>();
    for (const c of connections) {
      map.set(`${c.from.lon},${c.from.lat}`, c.from);
      map.set(`${c.to.lon},${c.to.lat}`, c.to);
    }
    return [...map.values()].map((c, i) => ({
      city: c,
      x: round(projX(c.lon)),
      y: round(projY(c.lat)),
      delay: i * 0.28,
    }));
  }, [connections]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      <svg
        viewBox="0 18 800 322"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        <defs>
          <filter id={blurId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.6" />
          </filter>
        </defs>

        {/* Dotted continents, gentle idle breathing keeps it alive at rest */}
        <motion.g
          animate={{ opacity: [0.82, 1, 0.82] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          {LAND_DOTS.map((d, i) => (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={d.r}
              fill={`rgba(150,160,255,${d.o})`}
            />
          ))}
        </motion.g>

        {/* Resting route network */}
        <g>
          {arcs.map((arc, i) => (
            <path
              key={i}
              d={arc.d}
              stroke="rgba(124,108,255,0.16)"
              strokeWidth={1}
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Travelling light pulses */}
        <g>
          {arcs.map((arc, i) => (
            <g key={i}>
              <motion.path
                d={arc.d}
                stroke="#7c6cff"
                strokeWidth={3.4}
                strokeLinecap="round"
                strokeDasharray={`${arc.dash} ${arc.gap}`}
                filter={`url(#${blurId})`}
                opacity={0.55}
                initial={{ strokeDashoffset: arc.dash }}
                animate={{ strokeDashoffset: -arc.len }}
                transition={{
                  duration: 1.9,
                  ease: [0.16, 1, 0.3, 1],
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  delay: arc.delay,
                }}
              />
              <motion.path
                d={arc.d}
                stroke="#b8c2ff"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeDasharray={`${arc.dash} ${arc.gap}`}
                initial={{ strokeDashoffset: arc.dash }}
                animate={{ strokeDashoffset: -arc.len }}
                transition={{
                  duration: 1.9,
                  ease: [0.16, 1, 0.3, 1],
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  delay: arc.delay,
                }}
              />
            </g>
          ))}
        </g>

        {/* City nodes */}
        <g>
          {cities.map(({ city, x, y, delay }) => {
            const anchorEnd = x > MAP_W * 0.62;
            return (
              <g key={city.label}>
                <motion.circle
                  cx={x}
                  cy={y}
                  fill="rgba(124,108,255,0.3)"
                  initial={{ r: 3, opacity: 0.55 }}
                  animate={{ r: 12, opacity: 0 }}
                  transition={{
                    duration: 2.6,
                    ease: "easeOut",
                    repeat: Infinity,
                    delay,
                  }}
                />
                <circle
                  cx={x}
                  cy={y}
                  r={4.5}
                  fill="#7c6cff"
                  opacity={0.35}
                  filter={`url(#${blurId})`}
                />
                <circle cx={x} cy={y} r={2.4} fill="#cdd2ff" />
                <circle
                  cx={x}
                  cy={y}
                  r={2.4}
                  fill="none"
                  stroke="#7c6cff"
                  strokeWidth={1}
                />
                {showLabels && (
                  <text
                    x={anchorEnd ? x - 7 : x + 7}
                    y={y + 3}
                    textAnchor={anchorEnd ? "end" : "start"}
                    fontSize={9}
                    fontWeight={500}
                    letterSpacing="0.02em"
                    fill="rgba(255,255,255,0.6)"
                  >
                    {city.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Demo                                                                       */
/* -------------------------------------------------------------------------- */

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#050508]">
      {/* Ambient brand glows */}
      <div
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(124,108,255,0.22), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(91,140,255,0.18), transparent 70%)",
        }}
      />

      <WorldMap className="z-0" showLabels />

      {/* Legibility scrim on the left */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050508] via-[#050508]/50 to-transparent" />

      {/* Heading */}
      <div className="absolute left-6 top-6 z-10 max-w-[64%]">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-zinc-300 backdrop-blur-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          Live network
        </div>
        <h3 className="mt-3 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-[22px] font-semibold leading-tight text-transparent">
          Traffic routed in real time
        </h3>
        <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-zinc-400">
          Anycast edge across nine regions, every request lands on the closest
          node, then fans out worldwide.
        </p>
      </div>

      {/* Stats */}
      <div className="absolute bottom-6 left-6 z-10 flex items-center gap-6">
        {[
          { value: "42ms", label: "median" },
          { value: "9", label: "regions" },
          { value: "1.2M", label: "req / s" },
        ].map((s) => (
          <div key={s.label}>
            <div className="text-lg font-semibold text-white">{s.value}</div>
            <div className="text-[11px] uppercase tracking-wider text-zinc-500">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
