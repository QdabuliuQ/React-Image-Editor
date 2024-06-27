import type { Canvas } from "@/types/canvas";

import { INIT_INSTANCE } from "./constants";

export function initInstance(payload: Canvas) {
  return {
    type: INIT_INSTANCE,
    payload,
  };
}
