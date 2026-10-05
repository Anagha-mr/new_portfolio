let cached: boolean | undefined;

/**
 * Best-effort feature check so the 3D layer degrades gracefully. Probed once
 * per session: the answer can't change, and every probe opens a real WebGL
 * context, which counts against the browser's live-context limit.
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  if (cached !== undefined) return cached;

  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as
      | WebGLRenderingContext
      | null;
    cached = Boolean(window.WebGLRenderingContext && gl);
    // Release the probe context now rather than whenever it is garbage collected.
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cached = false;
  }

  return cached;
}
