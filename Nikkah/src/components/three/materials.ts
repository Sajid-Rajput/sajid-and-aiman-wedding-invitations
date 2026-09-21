import { AdditiveBlending, MeshBasicMaterial, MeshPhysicalMaterial } from "three";

/** Shared instances: three.js best practice is to reuse materials across meshes. */
export const gold = new MeshPhysicalMaterial({
  color: "#ffd166",
  metalness: 1,
  roughness: 0.18,
  clearcoat: 0.8,
  clearcoatRoughness: 0.2,
  envMapIntensity: 2.2,
});

export const goldDeep = new MeshPhysicalMaterial({
  color: "#e0aa3e",
  metalness: 1,
  roughness: 0.28,
  clearcoat: 0.5,
  envMapIntensity: 2.0,
});

/** HDR colour (>1) + toneMapped:false is what Bloom at luminanceThreshold ~1 picks up. */
export const goldGlow = new MeshBasicMaterial({
  color: [2.6, 1.9, 0.8] as unknown as string,
  toneMapped: false,
  transparent: true,
  opacity: 0.9,
  blending: AdditiveBlending,
  depthWrite: false,
});

/** For small drifting ornaments: less mirror-like so they never read as black at glancing angles. */
export const goldSoft = new MeshPhysicalMaterial({
  color: "#e9c25a",
  metalness: 0.75,
  roughness: 0.38,
  clearcoat: 0.4,
  envMapIntensity: 1.6,
  emissive: "#3a2a06",
  emissiveIntensity: 0.9,
});
