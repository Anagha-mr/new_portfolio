"use client";

import { useSyncExternalStore } from "react";
import { isWebGLAvailable } from "@/three/utils/webgl";

const noSubscription = () => () => {};

/** WebGL support never changes mid-session, so there's nothing to subscribe to. */
export function useWebGLSupport(): boolean {
  return useSyncExternalStore(noSubscription, isWebGLAvailable, () => false);
}
