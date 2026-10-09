import type { ReactNode } from "react";
import type { SpatialSystem as SpatialData, Tone } from "@/data/projects";
import { TONES } from "@/components/projects/page/tone";

const STONE = "#817b73";
const IVORY = "#f1ede5";

const Frame = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 160 120" className="h-full w-full" aria-hidden="true" focusable="false" fill="none">
    {children}
  </svg>
);

/** Semantic embedding: a field of dots with varying weight. */
function Understanding() {
  const dots = Array.from({ length: 40 }, (_, i) => ({
    x: 20 + (i % 8) * 17,
    y: 22 + Math.floor(i / 8) * 19,
    o: 0.15 + ((i * 37) % 10) / 14,
  }));
  return (
    <Frame>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={2.4} fill={IVORY} fillOpacity={Math.min(d.o, 0.9)} />
      ))}
    </Frame>
  );
}

/** Depth map: nested rectangles, near surfaces lightest. */
function Depth() {
  return (
    <Frame>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={8 + i * 12}
          y={6 + i * 9}
          width={144 - i * 24}
          height={108 - i * 18}
          fill={IVORY}
          fillOpacity={0.5 - i * 0.08}
        />
      ))}
    </Frame>
  );
}

/** Guided generation: stacked planes constrained to one structure. */
function Generation() {
  return (
    <Frame>
      <path d="M30 88 L80 62 L130 88 L80 114 Z" stroke={STONE} />
      <path d="M30 70 L80 44 L130 70 L80 96 Z" stroke={STONE} fill={IVORY} fillOpacity={0.08} />
      <path d="M30 52 L80 26 L130 52 L80 78 Z" stroke={IVORY} fill={IVORY} fillOpacity={0.2} />
      <path d="M80 26 V78 M30 52 V88 M130 52 V88" stroke={STONE} strokeDasharray="2 3" />
    </Frame>
  );
}

/** Segmentation map: flat regions per object. */
function Segmentation() {
  return (
    <Frame>
      <rect x={8} y={8} width={144} height={62} fill={STONE} fillOpacity={0.12} />
      <rect x={8} y={70} width={144} height={42} fill={STONE} fillOpacity={0.24} />
      <rect x={22} y={44} width={62} height={30} fill={IVORY} fillOpacity={0.4} />
      <rect x={100} y={20} width={38} height={34} fill={IVORY} fillOpacity={0.18} />
      <ellipse cx={72} cy={92} rx={26} ry={9} fill={IVORY} fillOpacity={0.3} />
      <rect x={112} y={60} width={16} height={14} fill={STONE} fillOpacity={0.5} />
    </Frame>
  );
}

/** Taste space: points, one selected. */
function Personalisation() {
  const points: [number, number][] = [
    [26, 30], [40, 44], [34, 66], [58, 24], [64, 52], [50, 84], [92, 90], [110, 30], [128, 48], [120, 76], [96, 58], [80, 100],
  ];
  return (
    <Frame>
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.6} fill={IVORY} fillOpacity={0.55} />
      ))}
      <circle cx={104} cy={44} r={9} stroke="#5b7fc7" />
      <circle cx={104} cy={44} r={3} fill="#5b7fc7" />
    </Frame>
  );
}

const VISUALS = [Understanding, Depth, Generation, Segmentation, Personalisation];

export function SpatialSystem({ data, tone }: { data: SpatialData; tone: Tone }) {
  const t = TONES[tone];

  return (
    <ol className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-5 md:gap-6">
      {data.stages.map((stage, i) => {
        const Visual = VISUALS[i] ?? Understanding;
        return (
          <li key={stage.name} data-reveal className="flex gap-5 md:flex-col md:gap-0">
            <div className={`aspect-[4/3] w-32 shrink-0 border ${t.rule} bg-charcoal/60 md:w-full`}>
              <Visual />
            </div>
            <div className="md:mt-6">
              <p className={`font-mono text-xs ${t.accent}`}>{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 font-display text-2xl leading-tight md:text-[1.7rem]">{stage.name}</h3>
              <p className={`mt-2 font-mono text-[0.7rem] uppercase tracking-[0.1em] ${t.muted}`}>{stage.model}</p>
              <p className={`mt-3 text-sm leading-relaxed ${t.soft}`}>{stage.detail}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
