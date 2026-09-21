"use client";
import { useSyncExternalStore } from "react";

export type DeviceTier = "high" | "medium" | "low" | "none";

/**
 * Cheap, synchronous capability gate decided once on the client.
 * "none"  -> no WebGL at all (or reduced motion): render the CSS-only hero.
 * "low"   -> WebGL but weak device: no post-processing, fewer particles, dpr 1.
 * "medium"-> bloom on, moderate particles, dpr <= 1.5.
 * "high"  -> everything.
 */
function detect(): DeviceTier {
  if (typeof window === "undefined") return "none";
  // QA override, e.g. ?tier=high, so headless/software renderers can exercise the full pipeline.
  const forced = new URLSearchParams(window.location.search).get("tier");
  if (forced === "high" || forced === "medium" || forced === "low" || forced === "none") return forced;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "none";

  let gl: WebGLRenderingContext | null = null;
  try {
    const canvas = document.createElement("canvas");
    gl = (canvas.getContext("webgl2") ?? canvas.getContext("webgl")) as WebGLRenderingContext | null;
  } catch {
    gl = null;
  }
  if (!gl) return "none";

  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean; effectiveType?: string } };
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const saveData = nav.connection?.saveData === true;
  const slowNet = /(^|-)2g$/.test(nav.connection?.effectiveType ?? "");
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.matchMedia("(pointer: coarse)").matches;

  let renderer = "";
  try {
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    if (dbg) renderer = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)).toLowerCase();
  } catch {
    /* ignore */
  }
  // Android reports e.g. "ANGLE (Qualcomm, Adreno (TM) 610, OpenGL ES 3.2)", so the model number is
  // never adjacent to the word; match the real strings and cover today's budget GPUs.
  const software = /swiftshader|llvmpipe|softpipe|basic render/.test(renderer);
  const weakGpu =
    software ||
    /adreno \(tm\) [1-5]\d\d\b|adreno \(tm\) 6[01]\d\b|mali-4\d\d|mali-t[678]\d\d|mali-g[35]\d\b|mali-g7[12]\b|powervr (sgx|rogue ge8)/.test(renderer);
  // Keep unused-binding lint quiet while allowing future use of `gl` for more probes.
  void gl;

  // Software rendering, Data Saver and 2G get the CSS hero: no three.js chunk is even fetched.
  if (software || saveData || slowNet) return "none";
  if (weakGpu || memory <= 2 || cores <= 2) return "low";
  if (isMobile || memory <= 4 || cores <= 4) return "medium";
  return "high";
}

let cached: DeviceTier | null = null;
const subscribe = () => () => {};
const getSnapshot = () => (cached ??= detect());
const getServerSnapshot = (): DeviceTier => "none";

/** Hydration-safe: server and first client render both return "none"; the real tier is applied after hydration. */
export function useDeviceTier(): DeviceTier {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
