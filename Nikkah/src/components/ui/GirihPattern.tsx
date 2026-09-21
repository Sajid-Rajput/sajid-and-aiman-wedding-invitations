import type { CSSProperties } from "react";

/**
 * Classic "star and cross" (khatam) tessellation: an 8-pointed star tile whose negative space forms crosses.
 * Pure SVG <pattern>, so it scales crisply and costs nothing to animate via opacity/transform.
 */
export function GirihPattern({
  id = "girih",
  size = 96,
  stroke = "currentColor",
  strokeWidth = 1,
  opacity = 0.12,
  className,
  style,
}: {
  id?: string;
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  className?: string;
  style?: CSSProperties;
}) {
  // Octagram from two squares rotated 45°, inscribed in a unit tile; edges continue into neighbours.
  const s = 100;
  const c = s / 2;
  // Circumradius = half tile, so the star tips of neighbouring tiles meet and the gaps become crosses.
  const sq = (rot: number, radius: number) => {
    const pts: string[] = [];
    for (let i = 0; i < 4; i++) {
      const a = rot + (i * Math.PI) / 2 + Math.PI / 4;
      pts.push(`${(c + Math.cos(a) * radius).toFixed(2)},${(c + Math.sin(a) * radius).toFixed(2)}`);
    }
    return pts.join(" ");
  };
  const R = c;
  const inner = c * 0.42;

  return (
    <svg aria-hidden="true" className={className} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", ...style }}>
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse" viewBox={`0 0 ${s} ${s}`}>
          <g fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" opacity={opacity}>
            <polygon points={sq(0, R)} />
            <polygon points={sq(Math.PI / 4, R)} />
            <polygon points={sq(0, inner)} />
            <polygon points={sq(Math.PI / 4, inner)} />
            <circle cx={c} cy={c} r={inner * 0.35} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
