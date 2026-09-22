/**
 * The break between two sections: two tapering gold rules with a small khatam (eight-point star)
 * between them. On a phone the page is one long dark column, so every section needs a visible end —
 * this is that full stop, and it repeats the khatam of the seal and the favicon.
 */
export function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`sec-divider ${className}`} aria-hidden="true">
      <span className="sec-divider-rule" />
      <svg className="sec-divider-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
        <rect x="5.5" y="5.5" width="13" height="13" />
        <rect x="5.5" y="5.5" width="13" height="13" transform="rotate(45 12 12)" />
        <circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" />
      </svg>
      <span className="sec-divider-rule" />
    </div>
  );
}
