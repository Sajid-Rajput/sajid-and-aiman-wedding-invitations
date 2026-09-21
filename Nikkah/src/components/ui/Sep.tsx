/**
 * Separator dot for Urdu runs.
 * U+00B7 is absent from Noto Nastaliq Urdu, so inside Urdu text it falls back to a serif dot on the
 * baseline that reads as the Urdu zero ۰ and corrupts numbers. Rendering it in the Latin face with
 * generous side spacing keeps it unmistakably a separator.
 */
export function Sep() {
  return (
    <span className="sep" aria-hidden="true">
      ·
    </span>
  );
}
