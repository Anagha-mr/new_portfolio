"use client";

import { useSyncExternalStore } from "react";
import { isWebGLAvailable } from "@/three/utils/webgl";

const noSubscription = () => () => {};

/** WebGL support doesn't change mid-session, so there is nothing to subscribe to. */
export function useWebGLSupport(): boolean {
  return useSyncExternalStore(noSubscription, isWebGLAvailable, () => false);
}
