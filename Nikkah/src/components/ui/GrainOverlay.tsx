/** Film grain that kills gradient banding on dark backgrounds. Fixed, non-interactive, 6% soft-light. */
export function GrainOverlay() {
  return (
    <svg
      aria-hidden="true"
      className="grain"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100lvh", pointerEvents: "none", zIndex: 60, opacity: "var(--grain-opacity, 0.06)", mixBlendMode: "soft-light" }}
    >
      <filter id="grain-f">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="7" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-f)" />
    </svg>
  );
}
