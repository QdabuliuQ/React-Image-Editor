import type { Canvas } from "@/types/canvas";
import type { Action } from "@/types/reduxType";

import { INIT_INSTANCE } from "./constants";

const initialValue: Canvas | null = null;

const instanceReducer = (
  state = initialValue,
  action: Action<Canvas | null>
) => {
  const { type, payload } = action;
  if (type === INIT_INSTANCE) {
    return payload;
  }
  return state;
};

export default instanceReducer;
