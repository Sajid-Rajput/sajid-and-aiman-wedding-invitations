import { setConsoleFunction } from "three";

/**
 * three r183 deprecated THREE.Clock in favour of THREE.Timer, but @react-three/fiber still constructs
 * one per Canvas root (`clock: new THREE.Clock()` in its root store), so every mount logs the warning
 * and there is no construction site of ours to fix. `setConsoleFunction` is three's supported hook for
 * routing its own console output, so drop that single message and pass everything else through.
 *
 * Remove once @react-three/fiber moves to THREE.Timer — still outstanding in 9.7.0, the current latest.
 */
const CLOCK_DEPRECATION = "THREE.Clock: This module has been deprecated.";

setConsoleFunction((type, message, ...params) => {
  if (type === "warn" && message.startsWith(CLOCK_DEPRECATION)) return;
  console[type](message, ...params);
});
