import { INIT_CANVAS, UPDATE_CANVAS } from "./constant";
import type { Action } from "@/types/reduxType";

const initialValue: {
  width: number
  height: number
  fill: string
} = {
  width: 500,
  height: 600,
  fill: "#fff",
};

const canvasReducer = (state = initialValue, action: Action<any>) => {
  const { type, payload } = action;

  if (type === INIT_CANVAS) {
    return payload;
  } else if (type === UPDATE_CANVAS) {
    const { key, value } = payload;
    (state as any)[key] = value;
    return {
      ...state,
    };
  } else {
    return state;
  }
};

export default canvasReducer;
